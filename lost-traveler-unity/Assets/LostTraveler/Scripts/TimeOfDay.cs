using System;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace LostTraveler
{
    // The three parts of the day from the Game Rules: 朝 morning, 昼 afternoon, 夜 evening.
    public enum DayPart { Asa_Morning, Hiru_Afternoon, Yoru_Evening }

    [Serializable]
    public class TimeLook
    {
        [Header("Sun")]
        public Vector2 sunAngle = new Vector2(45, 30); // x = height, y = direction
        public Color sunColor = Color.white;
        public float sunIntensity = 1.3f;

        [Header("Toon tones")]
        public Color ambient = new Color(0.6f, 0.62f, 0.7f);
        public Color shadowTint = new Color(0.75f, 0.78f, 0.95f);
        [Range(0, 1)] public float night;

        [Header("Sky and fog")]
        public Color skyTop = new Color(0.25f, 0.55f, 0.95f);
        public Color skyHorizon = new Color(0.8f, 0.9f, 1f);
        public Color skyGlow = new Color(1f, 0.85f, 0.7f);
        public float skyGlowStrength = 0.3f;
        public Color fog = new Color(0.8f, 0.87f, 0.95f);

        [Header("Color grading")]
        public Color colorFilter = Color.white;
        public float exposure;
        public float saturation = 10;
        public float bloom = 0.4f;
    }

    // Changes lighting, sky, glow and grading for each part of the day.
    // Pick the part of the day in the Inspector to preview it in the editor.
    [ExecuteAlways]
    public class TimeOfDay : MonoBehaviour
    {
        public DayPart part = DayPart.Hiru_Afternoon;

        public Light sun;
        public Material skyMaterial;
        public VolumeProfile volumeProfile;
        [Tooltip("Lamps and sign lights that turn on in the evening")]
        public Light[] nightLights = Array.Empty<Light>();

        public TimeLook morning = new TimeLook
        {
            // Soft, pale blue light, long shadows
            sunAngle = new Vector2(16, 55), sunColor = new Color(1f, 0.95f, 0.88f), sunIntensity = 0.86f,
            ambient = new Color(0.74f, 0.8f, 0.94f), shadowTint = new Color(0.8f, 0.86f, 1f), night = 0,
            skyTop = new Color(0.47f, 0.68f, 0.92f), skyHorizon = new Color(0.86f, 0.91f, 0.96f),
            skyGlow = new Color(1f, 0.9f, 0.78f), skyGlowStrength = 0.35f, fog = new Color(0.82f, 0.88f, 0.95f),
            colorFilter = new Color(0.95f, 0.98f, 1f), exposure = 0f, saturation = 0, bloom = 0.3f
        };

        public TimeLook afternoon = new TimeLook
        {
            // Bright, warm sun
            sunAngle = new Vector2(48, -28), sunColor = new Color(1f, 0.95f, 0.85f), sunIntensity = 0.9f,
            ambient = new Color(0.8f, 0.79f, 0.88f), shadowTint = new Color(0.84f, 0.82f, 0.98f), night = 0,
            skyTop = new Color(0.22f, 0.52f, 0.95f), skyHorizon = new Color(0.74f, 0.88f, 1f),
            skyGlow = new Color(1f, 0.95f, 0.85f), skyGlowStrength = 0.15f, fog = new Color(0.78f, 0.88f, 0.98f),
            colorFilter = new Color(1f, 0.98f, 0.95f), exposure = 0f, saturation = 12, bloom = 0.3f
        };

        public TimeLook evening = new TimeLook
        {
            // Orange sunset turning to blue night; signs, lanterns and vending machines glow
            sunAngle = new Vector2(5, -72), sunColor = new Color(1f, 0.55f, 0.32f), sunIntensity = 0.55f,
            ambient = new Color(0.36f, 0.4f, 0.62f), shadowTint = new Color(0.75f, 0.72f, 1f), night = 1,
            skyTop = new Color(0.1f, 0.13f, 0.34f), skyHorizon = new Color(0.98f, 0.58f, 0.42f),
            skyGlow = new Color(1f, 0.55f, 0.3f), skyGlowStrength = 0.6f, fog = new Color(0.32f, 0.3f, 0.48f),
            colorFilter = new Color(0.94f, 0.94f, 1f), exposure = 0f, saturation = 5, bloom = 0.9f
        };

        static readonly int AmbientId = Shader.PropertyToID("_ToonAmbient");
        static readonly int ShadowTintId = Shader.PropertyToID("_ToonShadowTint");
        static readonly int NightId = Shader.PropertyToID("_ToonNight");

        public TimeLook Current => part switch
        {
            DayPart.Asa_Morning => morning,
            DayPart.Yoru_Evening => evening,
            _ => afternoon
        };

        void OnEnable() => Apply();
        void OnValidate() => Apply();

        public void Set(DayPart p)
        {
            part = p;
            Apply();
        }

        public void Apply()
        {
            var t = Current;

            if (sun)
            {
                sun.transform.rotation = Quaternion.Euler(t.sunAngle.x, t.sunAngle.y, 0);
                sun.color = t.sunColor;
                sun.intensity = t.sunIntensity;
            }

            Shader.SetGlobalColor(AmbientId, t.ambient);
            Shader.SetGlobalColor(ShadowTintId, t.shadowTint);
            Shader.SetGlobalFloat(NightId, t.night);

            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.Linear;
            RenderSettings.fogStartDistance = 30;
            RenderSettings.fogEndDistance = 110;
            RenderSettings.fogColor = t.fog;

            if (skyMaterial)
            {
                RenderSettings.skybox = skyMaterial;
                skyMaterial.SetColor("_TopColor", t.skyTop);
                skyMaterial.SetColor("_HorizonColor", t.skyHorizon);
                skyMaterial.SetColor("_BottomColor", t.fog);
                skyMaterial.SetColor("_GlowColor", t.skyGlow);
                skyMaterial.SetFloat("_GlowStrength", t.skyGlowStrength);
            }

            foreach (var l in nightLights)
                if (l) l.enabled = t.night > 0.5f;

            if (volumeProfile)
            {
                if (volumeProfile.TryGet(out ColorAdjustments ca))
                {
                    ca.colorFilter.Override(t.colorFilter);
                    ca.postExposure.Override(t.exposure);
                    ca.saturation.Override(t.saturation);
                }
                if (volumeProfile.TryGet(out Bloom b))
                    b.intensity.Override(t.bloom);
            }
        }
    }
}
