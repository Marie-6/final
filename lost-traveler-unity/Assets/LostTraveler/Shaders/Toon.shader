// Lost Traveler toon shader (URP, Unity 6).
// Art direction: two or three tone steps, soft outlines, bright and warm colors.
// Global values (_ToonAmbient, _ToonShadowTint, _ToonNight) come from TimeOfDay.cs.
Shader "LostTraveler/Toon"
{
    Properties
    {
        _BaseColor ("Base Color", Color) = (1,1,1,1)
        _BaseMap ("Base Map", 2D) = "white" {}

        [Header(Tone steps)]
        _Step1 ("Lit step", Range(0,1)) = 0.45
        _Step2 ("Mid step", Range(0,1)) = 0.12
        _Feather ("Step softness", Range(0.001,0.2)) = 0.025
        _MidAmount ("Mid tone brightness", Range(0,1)) = 0.45

        [Header(Rim)]
        _RimColor ("Rim Color", Color) = (1,1,1,1)
        _RimStrength ("Rim Strength", Range(0,1)) = 0.12

        [Header(Glow)]
        [HDR] _EmissionColor ("Emission (HDR)", Color) = (0,0,0,0)
        _DayEmission ("Glow during the day (0 = night only)", Range(0,1)) = 1

        [Header(Outline)]
        _OutlineColor ("Outline Color", Color) = (0.17,0.15,0.22,1)
        _OutlineWidth ("Outline Width", Range(0,0.02)) = 0.0035
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" "RenderPipeline"="UniversalPipeline" "Queue"="Geometry" }

        HLSLINCLUDE
        #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

        CBUFFER_START(UnityPerMaterial)
            float4 _BaseMap_ST;
            half4 _BaseColor;
            half _Step1, _Step2, _Feather, _MidAmount;
            half4 _RimColor;
            half _RimStrength;
            half4 _EmissionColor;
            half _DayEmission;
            half4 _OutlineColor;
            float _OutlineWidth;
        CBUFFER_END

        TEXTURE2D(_BaseMap); SAMPLER(sampler_BaseMap);

        // Set every frame by TimeOfDay.cs
        half4 _ToonAmbient;     // light in the shaded tone
        half4 _ToonShadowTint;  // color of shadows (blue in the morning, purple at night)
        half _ToonNight;        // 0 = day, 1 = night
        ENDHLSL

        // ---------- Main lit pass ----------
        Pass
        {
            Name "ToonForward"
            Tags { "LightMode"="UniversalForward" }
            Cull Back

            HLSLPROGRAM
            #pragma target 3.0
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile _ _MAIN_LIGHT_SHADOWS _MAIN_LIGHT_SHADOWS_CASCADE _MAIN_LIGHT_SHADOWS_SCREEN
            #pragma multi_compile _ _ADDITIONAL_LIGHTS_VERTEX _ADDITIONAL_LIGHTS
            #pragma multi_compile _ _CLUSTER_LIGHT_LOOP
            #pragma multi_compile_fragment _ _ADDITIONAL_LIGHT_SHADOWS
            #pragma multi_compile_fragment _ _SHADOWS_SOFT _SHADOWS_SOFT_LOW _SHADOWS_SOFT_MEDIUM _SHADOWS_SOFT_HIGH
            #pragma multi_compile _ _LIGHT_LAYERS
            #pragma multi_compile_fog
            #pragma multi_compile_instancing
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 positionWS : TEXCOORD1;
                float3 normalWS : TEXCOORD2;
                half fogFactor : TEXCOORD3;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            Varyings vert (Attributes v)
            {
                Varyings o = (Varyings)0;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_TRANSFER_INSTANCE_ID(v, o);
                VertexPositionInputs p = GetVertexPositionInputs(v.positionOS.xyz);
                o.positionCS = p.positionCS;
                o.positionWS = p.positionWS;
                o.normalWS = TransformObjectToWorldNormal(v.normalOS);
                o.uv = TRANSFORM_TEX(v.uv, _BaseMap);
                o.fogFactor = ComputeFogFactor(p.positionCS.z);
                return o;
            }

            // 0 = shade, _MidAmount = mid tone, 1 = lit
            half ToonBand (half l)
            {
                half lit = smoothstep(_Step1 - _Feather, _Step1 + _Feather, l);
                half mid = smoothstep(_Step2 - _Feather, _Step2 + _Feather, l);
                return lerp(mid * _MidAmount, 1.0h, lit);
            }

            half4 frag (Varyings i) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(i);
                half4 albedo = SAMPLE_TEXTURE2D(_BaseMap, sampler_BaseMap, i.uv) * _BaseColor;
                float3 n = normalize(i.normalWS);
                float3 viewDir = GetWorldSpaceNormalizeViewDir(i.positionWS);

                float4 shadowCoord = TransformWorldToShadowCoord(i.positionWS);
                Light sun = GetMainLight(shadowCoord);
                half ndl = saturate(dot(n, sun.direction));
                half band = ToonBand(ndl * sun.shadowAttenuation * sun.distanceAttenuation);

                half3 shadeLight = _ToonAmbient.rgb * _ToonShadowTint.rgb;
                half3 litLight = _ToonAmbient.rgb * 0.15h + sun.color;
                half3 lightCol = lerp(shadeLight, litLight, band);

                // Street lamps and signs: hard-edged pools of light
                half3 extra = 0;
                #if defined(_ADDITIONAL_LIGHTS)
                InputData inputData = (InputData)0;
                inputData.positionWS = i.positionWS;
                inputData.normalWS = n;
                inputData.normalizedScreenSpaceUV = GetNormalizedScreenSpaceUV(i.positionCS);
                uint lightCount = GetAdditionalLightsCount();
                #if USE_CLUSTER_LIGHT_LOOP
                UNITY_LOOP for (uint li = 0; li < min(URP_FP_DIRECTIONAL_LIGHTS_COUNT, MAX_VISIBLE_LIGHTS); li++)
                {
                    Light l = GetAdditionalLight(li, i.positionWS, half4(1,1,1,1));
                    half a = saturate(dot(n, l.direction)) * l.distanceAttenuation * l.shadowAttenuation;
                    extra += l.color * smoothstep(0.02, 0.06, a) * min(a * 4, 1);
                }
                #endif
                LIGHT_LOOP_BEGIN(lightCount)
                    Light l = GetAdditionalLight(lightIndex, i.positionWS, half4(1,1,1,1));
                    half a = saturate(dot(n, l.direction) * 0.5 + 0.5) * l.distanceAttenuation * l.shadowAttenuation;
                    // two soft steps so lamp light looks painted, not realistic
                    half s = smoothstep(0.015, 0.03, a) * 0.5 + smoothstep(0.12, 0.16, a) * 0.5;
                    extra += l.color * s;
                LIGHT_LOOP_END
                #endif

                half3 color = albedo.rgb * (lightCol + extra);

                // Thin rim of light on the edges facing away from the camera
                half rim = pow(1.0h - saturate(dot(n, viewDir)), 4.0h) * band;
                color += _RimColor.rgb * rim * _RimStrength;

                // Glow: some things glow only at night
                color += _EmissionColor.rgb * lerp(_DayEmission, 1.0h, _ToonNight);

                color = MixFog(color, i.fogFactor);
                return half4(color, 1);
            }
            ENDHLSL
        }

        // ---------- Soft outline (inverted hull) ----------
        // Uses smoothed normals stored in UV3 so boxes have no gaps at corners.
        Pass
        {
            Name "ToonOutline"
            Tags { "LightMode"="SRPDefaultUnlit" }
            Cull Front

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog
            #pragma multi_compile_instancing

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float3 smoothNormal : TEXCOORD3;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                half fogFactor : TEXCOORD0;
            };

            Varyings vert (Attributes v)
            {
                Varyings o;
                UNITY_SETUP_INSTANCE_ID(v);
                float3 nOS = dot(v.smoothNormal, v.smoothNormal) > 0.01 ? v.smoothNormal : v.normalOS;
                float4 cs = TransformObjectToHClip(v.positionOS.xyz);
                float3 nCS = mul((float3x3)UNITY_MATRIX_VP, TransformObjectToWorldNormal(nOS));
                float2 dir = normalize(nCS.xy + 1e-5);
                float aspect = _ScreenParams.y / _ScreenParams.x;
                dir.x *= aspect;
                // constant width on screen, a little thinner far away
                cs.xy += dir * _OutlineWidth * min(cs.w, 12.0) * 2.0;
                o.positionCS = cs;
                o.fogFactor = ComputeFogFactor(cs.z);
                return o;
            }

            half4 frag (Varyings i) : SV_Target
            {
                half3 c = _OutlineColor.rgb * lerp(1.0h, 0.6h, _ToonNight);
                if (_OutlineWidth <= 0) discard;
                return half4(MixFog(c, i.fogFactor), 1);
            }
            ENDHLSL
        }

        // ---------- Shadows ----------
        Pass
        {
            Name "ShadowCaster"
            Tags { "LightMode"="ShadowCaster" }
            ZWrite On ZTest LEqual ColorMask 0 Cull Back

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            #pragma multi_compile_vertex _ _CASTING_PUNCTUAL_LIGHT_SHADOW
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Shadows.hlsl"

            float3 _LightDirection;
            float3 _LightPosition;

            struct Attributes { float4 positionOS : POSITION; float3 normalOS : NORMAL; UNITY_VERTEX_INPUT_INSTANCE_ID };
            struct Varyings { float4 positionCS : SV_POSITION; };

            Varyings vert (Attributes v)
            {
                Varyings o;
                UNITY_SETUP_INSTANCE_ID(v);
                float3 posWS = TransformObjectToWorld(v.positionOS.xyz);
                float3 nWS = TransformObjectToWorldNormal(v.normalOS);
                #if _CASTING_PUNCTUAL_LIGHT_SHADOW
                    float3 lightDir = normalize(_LightPosition - posWS);
                #else
                    float3 lightDir = _LightDirection;
                #endif
                float4 cs = TransformWorldToHClip(ApplyShadowBias(posWS, nWS, lightDir));
                #if UNITY_REVERSED_Z
                    cs.z = min(cs.z, UNITY_NEAR_CLIP_VALUE);
                #else
                    cs.z = max(cs.z, UNITY_NEAR_CLIP_VALUE);
                #endif
                o.positionCS = cs;
                return o;
            }
            half4 frag (Varyings i) : SV_Target { return 0; }
            ENDHLSL
        }

        // ---------- Depth (for depth of field later) ----------
        Pass
        {
            Name "DepthOnly"
            Tags { "LightMode"="DepthOnly" }
            ZWrite On ColorMask R Cull Back

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            struct Attributes { float4 positionOS : POSITION; UNITY_VERTEX_INPUT_INSTANCE_ID };
            struct Varyings { float4 positionCS : SV_POSITION; };
            Varyings vert (Attributes v) { Varyings o; UNITY_SETUP_INSTANCE_ID(v); o.positionCS = TransformObjectToHClip(v.positionOS.xyz); return o; }
            half frag (Varyings i) : SV_Target { return i.positionCS.z; }
            ENDHLSL
        }

        Pass
        {
            Name "DepthNormals"
            Tags { "LightMode"="DepthNormals" }
            ZWrite On Cull Back

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            struct Attributes { float4 positionOS : POSITION; float3 normalOS : NORMAL; UNITY_VERTEX_INPUT_INSTANCE_ID };
            struct Varyings { float4 positionCS : SV_POSITION; float3 normalWS : TEXCOORD0; };
            Varyings vert (Attributes v) { Varyings o; UNITY_SETUP_INSTANCE_ID(v); o.positionCS = TransformObjectToHClip(v.positionOS.xyz); o.normalWS = TransformObjectToWorldNormal(v.normalOS); return o; }
            half4 frag (Varyings i) : SV_Target { return half4(NormalizeNormalPerPixel(i.normalWS), 0); }
            ENDHLSL
        }
    }
    FallBack Off
}
