// Simple painted sky: a smooth gradient with a soft sun glow near the horizon.
// Colors are set by TimeOfDay.cs.
Shader "LostTraveler/AnimeSky"
{
    Properties
    {
        _TopColor ("Top", Color) = (0.25,0.55,0.95,1)
        _HorizonColor ("Horizon", Color) = (0.8,0.9,1,1)
        _BottomColor ("Below horizon", Color) = (0.7,0.75,0.8,1)
        _GlowColor ("Sun glow", Color) = (1,0.8,0.6,1)
        _GlowSize ("Glow size", Range(1,64)) = 8
        _GlowStrength ("Glow strength", Range(0,2)) = 0.4
    }
    SubShader
    {
        Tags { "Queue"="Background" "RenderType"="Background" "PreviewType"="Skybox" "RenderPipeline"="UniversalPipeline" }
        Cull Off ZWrite Off

        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/RealtimeLights.hlsl"

            half4 _TopColor, _HorizonColor, _BottomColor, _GlowColor;
            half _GlowSize, _GlowStrength;

            struct Attributes { float4 positionOS : POSITION; };
            struct Varyings { float4 positionCS : SV_POSITION; float3 dir : TEXCOORD0; };

            Varyings vert (Attributes v)
            {
                Varyings o;
                o.positionCS = TransformObjectToHClip(v.positionOS.xyz);
                o.dir = v.positionOS.xyz;
                return o;
            }

            half4 frag (Varyings i) : SV_Target
            {
                float3 d = normalize(i.dir);
                half up = saturate(d.y);
                half3 c = lerp(_HorizonColor.rgb, _TopColor.rgb, pow(up, 0.55));
                c = lerp(c, _BottomColor.rgb, saturate(-d.y * 6));
                // glow around the sun, strongest at the horizon
                float3 sunDir = _MainLightPosition.xyz;
                half g = pow(saturate(dot(d, sunDir) * 0.5 + 0.5), _GlowSize);
                c += _GlowColor.rgb * g * _GlowStrength * (1 - up * 0.7);
                return half4(c, 1);
            }
            ENDHLSL
        }
    }
}
