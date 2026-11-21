using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace LostTraveler.EditorTools
{
    // Builds a look-test scene: the front of the language school (日本語学校)
    // from simple blocks, in the anime toon style, with 朝 / 昼 / 夜 lighting.
    // Menu: Lost Traveler > Build School Scene, and Lost Traveler > Capture Screenshots.
    public static class SchoolSceneBuilder
    {
        const string Root = "Assets/LostTraveler";
        const string Gen = Root + "/Generated";
        const string ScenePath = Root + "/Scenes/School.unity";
        const string FontPath = Root + "/Fonts/ZenMaruGothic-Bold.ttf";

        enum Shape { Cube, Cylinder, Sphere, Capsule }

        static readonly Dictionary<Shape, Mesh> meshes = new();
        static readonly Dictionary<string, Material> mats = new();
        static Shader toon;
        static Font font;
        static readonly List<Light> nightLights = new();

        // ---------------------------------------------------------------- menu

        [MenuItem("Lost Traveler/Build School Scene")]
        public static void Build()
        {
            meshes.Clear(); mats.Clear(); nightLights.Clear();
            AssetDatabase.DeleteAsset(Gen);
            Directory.CreateDirectory(Gen + "/Materials");
            Directory.CreateDirectory(Gen + "/Meshes");
            Directory.CreateDirectory(Root + "/Scenes");
            AssetDatabase.Refresh();

            toon = Shader.Find("LostTraveler/Toon");
            font = AssetDatabase.LoadAssetAtPath<Font>(FontPath);
            foreach (Shape s in System.Enum.GetValues(typeof(Shape))) meshes[s] = SmoothedCopy(s);

            SetUpRenderQuality();

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            var sun = new GameObject("Sun").AddComponent<Light>();
            sun.type = LightType.Directional;
            sun.shadows = LightShadows.Soft;
            sun.shadowStrength = 1f;
            sun.shadowBias = 0.15f;
            sun.shadowNormalBias = 0.7f;

            var cam = BuildCamera();
            var profile = BuildVolume();
            var sky = new Material(Shader.Find("LostTraveler/AnimeSky")) { name = "AnimeSky" };
            AssetDatabase.CreateAsset(sky, Gen + "/Materials/AnimeSky.mat");

            var world = new GameObject("Street").transform;
            BuildGround(world);
            BuildSchool(world);
            BuildGate(world);
            BuildSakura(world, new Vector3(5.6f, 0.02f, 2.4f));
            BuildVendingMachines(world);
            BuildBicycle(world, new Vector3(6.3f, 0.15f, -0.2f));
            BuildStreetLamp(world, new Vector3(-8.2f, 0.15f, -2.2f));
            BuildStreetLamp(world, new Vector3(9.4f, 0.15f, -2.2f));
            BuildPowerLines(world);
            BuildBookshop(world);
            BuildKuraya(world);
            BuildSkyline(world);

            var people = new GameObject("People (placeholders)").transform;
            BuildPerson(people, "Player", new Vector3(1.4f, 0.15f, -1.1f), new Color(0.42f, 0.7f, 0.92f), new Color(0.25f, 0.18f, 0.14f), 142f);
            BuildPerson(people, "Tanaka-sensei", new Vector3(-0.7f, 0.02f, 1.6f), new Color(0.55f, 0.4f, 0.3f), new Color(0.62f, 0.62f, 0.64f), -38f);

            var tod = new GameObject("Time Of Day").AddComponent<TimeOfDay>();
            tod.sun = sun;
            tod.skyMaterial = sky;
            tod.volumeProfile = profile;
            tod.nightLights = nightLights.ToArray();
            tod.Set(DayPart.Hiru_Afternoon);

            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            AssetDatabase.SaveAssets();
            Debug.Log("[LostTraveler] School scene built: " + ScenePath);
        }

        [MenuItem("Lost Traveler/Capture Screenshots")]
        public static void Capture()
        {
            if (EditorSceneManager.GetActiveScene().path != ScenePath)
                EditorSceneManager.OpenScene(ScenePath);

            ShaderUtil.allowAsyncCompilation = false;
            var tod = Object.FindFirstObjectByType<TimeOfDay>();
            var cam = Camera.main;
            string dir = Path.GetFullPath(Path.Combine(Application.dataPath, "../Screenshots"));
            Directory.CreateDirectory(dir);

            var parts = new[] { (DayPart.Asa_Morning, "1_asa_morning"), (DayPart.Hiru_Afternoon, "2_hiru_afternoon"), (DayPart.Yoru_Evening, "3_yoru_evening") };
            foreach (var (p, file) in parts)
            {
                tod.Set(p);
                RenderToPng(cam, Path.Combine(dir, $"school_{file}.png"), 1600, 900);
            }
            tod.Set(DayPart.Hiru_Afternoon);
            EditorSceneManager.SaveScene(EditorSceneManager.GetActiveScene());
            Debug.Log("[LostTraveler] Screenshots saved to " + dir);
        }

        // Used from the command line: -executeMethod LostTraveler.EditorTools.SchoolSceneBuilder.BuildAndCapture
        public static void BuildAndCapture()
        {
            Build();
            Capture();
        }

        static void RenderToPng(Camera cam, string path, int w, int h)
        {
            var rt = new RenderTexture(w, h, 24, RenderTextureFormat.ARGB32, RenderTextureReadWrite.sRGB);
            rt.Create();
            var req = new RenderPipeline.StandardRequest { destination = rt };
            for (int i = 0; i < 3; i++) // a few frames so fonts and shaders are ready
            {
                if (RenderPipeline.SupportsRenderRequest(cam, req)) RenderPipeline.SubmitRenderRequest(cam, req);
                else { cam.targetTexture = rt; cam.Render(); cam.targetTexture = null; }
            }
            var prev = RenderTexture.active;
            RenderTexture.active = rt;
            var tex = new Texture2D(w, h, TextureFormat.RGB24, false);
            tex.ReadPixels(new Rect(0, 0, w, h), 0, 0);
            tex.Apply();
            RenderTexture.active = prev;
            File.WriteAllBytes(path, tex.EncodeToPNG());
            Object.DestroyImmediate(tex);
            rt.Release();
            Object.DestroyImmediate(rt);
        }

        // ------------------------------------------------------- render setup

        static void SetUpRenderQuality()
        {
            var rp = (QualitySettings.renderPipeline ?? GraphicsSettings.defaultRenderPipeline) as UniversalRenderPipelineAsset;
            if (rp == null) return;
            rp.msaaSampleCount = 4;      // clean outlines
            rp.shadowDistance = 45;
            rp.supportsHDR = true;
            EditorUtility.SetDirty(rp);
        }

        static Camera BuildCamera()
        {
            // Fixed, slightly raised camera that follows the player along the street.
            var go = new GameObject("Main Camera") { tag = "MainCamera" };
            var cam = go.AddComponent<Camera>();
            cam.fieldOfView = 40;
            cam.nearClipPlane = 0.3f;
            cam.farClipPlane = 200;
            cam.clearFlags = CameraClearFlags.Skybox;
            cam.allowHDR = true;
            go.transform.position = new Vector3(0, 7f, -16f);
            go.transform.LookAt(new Vector3(0, 2.7f, 3f));
            var data = cam.GetUniversalAdditionalCameraData();
            data.renderPostProcessing = true;
            data.antialiasing = AntialiasingMode.SubpixelMorphologicalAntiAliasing;
            data.antialiasingQuality = AntialiasingQuality.High;
            return cam;
        }

        static VolumeProfile BuildVolume()
        {
            var profile = ScriptableObject.CreateInstance<VolumeProfile>();
            AssetDatabase.CreateAsset(profile, Gen + "/SchoolLook.asset");

            var bloom = profile.Add<Bloom>(true);
            bloom.threshold.Override(1.0f);
            bloom.scatter.Override(0.65f);
            var ca = profile.Add<ColorAdjustments>(true);
            ca.contrast.Override(8f);
            var tm = profile.Add<Tonemapping>(true);
            tm.mode.Override(TonemappingMode.None); // keep anime colors bright and clean
            var vig = profile.Add<Vignette>(true);
            vig.intensity.Override(0.16f);
            vig.smoothness.Override(0.5f);
            foreach (var c in profile.components) AssetDatabase.AddObjectToAsset(c, profile);
            EditorUtility.SetDirty(profile);

            var vol = new GameObject("Look (post-processing)").AddComponent<Volume>();
            vol.isGlobal = true;
            vol.sharedProfile = profile;
            return profile;
        }

        // ------------------------------------------------------------ helpers

        static Color C(string hex) { ColorUtility.TryParseHtmlString(hex, out var c); return c; }

        static Material Mat(string name, Color color, Color? emission = null, float dayEmission = 1f, float outline = 0.0035f, Color? outlineColor = null)
        {
            if (mats.TryGetValue(name, out var m)) return m;
            m = new Material(toon) { name = name, enableInstancing = true };
            m.SetColor("_BaseColor", color);
            m.SetColor("_EmissionColor", emission ?? Color.black);
            m.SetFloat("_DayEmission", dayEmission);
            m.SetFloat("_OutlineWidth", outline);
            // outline is a darker, slightly purple version of the color, like ink in anime
            var oc = outlineColor ?? Color.Lerp(color * 0.35f, C("#2B2638"), 0.55f);
            oc.a = 1;
            m.SetColor("_OutlineColor", oc);
            AssetDatabase.CreateAsset(m, $"{Gen}/Materials/{name}.mat");
            mats[name] = m;
            return m;
        }

        static GameObject Make(string name, Shape shape, Transform parent, Vector3 pos, Vector3 scale, Material mat, Vector3 euler = default)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            go.transform.localEulerAngles = euler;
            go.transform.localScale = scale;
            go.AddComponent<MeshFilter>().sharedMesh = meshes[shape];
            var r = go.AddComponent<MeshRenderer>();
            r.sharedMaterial = mat;
            return go;
        }

        static GameObject Group(string name, Transform parent, Vector3 pos = default)
        {
            var g = new GameObject(name).transform;
            g.SetParent(parent, false);
            g.localPosition = pos;
            return g.gameObject;
        }

        // Japanese text for signs. Text faces the camera (toward -Z).
        static TextMesh Text(string text, Transform parent, Vector3 pos, float size, Color color, float lineSpacing = 1f)
        {
            var go = new GameObject("Text " + text.Replace("\n", ""));
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            var tm = go.AddComponent<TextMesh>();
            tm.font = font;
            tm.text = text;
            tm.fontSize = 96;
            tm.characterSize = size;
            tm.lineSpacing = lineSpacing;
            tm.anchor = TextAnchor.MiddleCenter;
            tm.alignment = TextAlignment.Center;
            tm.color = color;
            go.GetComponent<MeshRenderer>().sharedMaterial = font.material;
            return tm;
        }

        static Light PointLight(Transform parent, Vector3 pos, Color color, float intensity, float range)
        {
            var go = new GameObject("Night light");
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            var l = go.AddComponent<Light>();
            l.type = LightType.Point;
            l.color = color;
            l.intensity = intensity;
            l.range = range;
            l.shadows = LightShadows.None;
            nightLights.Add(l);
            return l;
        }

        // Copy of a built-in mesh with smoothed normals in UV3, so outlines have no gaps.
        static Mesh SmoothedCopy(Shape shape)
        {
            var src = Resources.GetBuiltinResource<Mesh>(shape + ".fbx");
            var m = Object.Instantiate(src);
            m.name = shape + "_Toon";
            var v = m.vertices; var n = m.normals;
            var sum = new Dictionary<Vector3Int, Vector3>();
            Vector3Int Key(Vector3 p) => Vector3Int.RoundToInt(p * 10000f);
            for (int i = 0; i < v.Length; i++)
            {
                var k = Key(v[i]);
                sum[k] = (sum.TryGetValue(k, out var s) ? s : Vector3.zero) + n[i];
            }
            var smooth = new List<Vector3>(v.Length);
            for (int i = 0; i < v.Length; i++) smooth.Add(sum[Key(v[i])].normalized);
            m.SetUVs(3, smooth);
            AssetDatabase.CreateAsset(m, $"{Gen}/Meshes/{m.name}.asset");
            return m;
        }

        // ------------------------------------------------------------- scene

        static void BuildGround(Transform world)
        {
            var g = Group("Ground", world).transform;
            Make("Base", Shape.Cube, g, new Vector3(0, -0.06f, 20), new Vector3(140, 0.1f, 90), Mat("Ground", C("#9AA39A"), outline: 0));
            Make("Road", Shape.Cube, g, new Vector3(0, 0, -8), new Vector3(70, 0.04f, 10.8f), Mat("Asphalt", C("#5D6274"), outline: 0));
            for (int i = -8; i <= 8; i++)
                Make("Lane dash", Shape.Cube, g, new Vector3(i * 4.5f, 0.03f, -8), new Vector3(2.2f, 0.02f, 0.16f), Mat("Road paint", C("#F4F1E6"), outline: 0));
            // crossing stripes in front of the school
            for (int i = 0; i < 6; i++)
                Make("Crossing", Shape.Cube, g, new Vector3(-3.6f, 0.03f, -3.6f - i * 1.5f), new Vector3(2.6f, 0.02f, 0.7f), Mat("Road paint", Color.white, outline: 0));
            Make("Sidewalk", Shape.Cube, g, new Vector3(0, 0.075f, -1), new Vector3(70, 0.15f, 3.2f), Mat("Sidewalk", C("#D9D3C7"), outline: 0.002f));
            Make("Curb", Shape.Cube, g, new Vector3(0, 0.08f, -2.55f), new Vector3(70, 0.17f, 0.15f), Mat("Curb", C("#B9B3A8"), outline: 0));
            Make("Schoolyard", Shape.Cube, g, new Vector3(0, 0.01f, 2.3f), new Vector3(14.6f, 0.03f, 3.6f), Mat("Yard tiles", C("#E9DFCB"), outline: 0));
            // tactile paving (the yellow guide blocks on Japanese sidewalks)
            Make("Guide blocks", Shape.Cube, g, new Vector3(0, 0.155f, -1.6f), new Vector3(70, 0.01f, 0.3f), Mat("Guide yellow", C("#F2C230"), outline: 0));
        }

        static void BuildSchool(Transform world)
        {
            var s = Group("日本語学校 Language School", world).transform;
            var wall = Mat("School wall", C("#F5ECDC"));
            var trim = Mat("School trim", C("#FFFFFF"));
            var roof = Mat("School roof", C("#B7AEA0"));
            var glass = Mat("Window glass", C("#7FA8C9"), outline: 0.0025f);
            var glassLit = Mat("Window glass lit", C("#7FA8C9"), C("#FFB45A") * 0.75f, 0f, 0.0025f);
            var frame = Mat("Window frame", C("#8C8273"), outline: 0);

            Make("Building", Shape.Cube, s, new Vector3(0, 3.6f, 8), new Vector3(14, 7.2f, 8), wall);
            Make("Floor band", Shape.Cube, s, new Vector3(0, 3.95f, 3.95f), new Vector3(14.1f, 0.22f, 0.2f), trim);
            Make("Roof edge", Shape.Cube, s, new Vector3(0, 7.35f, 8), new Vector3(14.3f, 0.35f, 8.3f), roof);
            Make("Water tank", Shape.Cylinder, s, new Vector3(4.5f, 8.2f, 9), new Vector3(1.4f, 0.7f, 1.4f), Mat("Tank", C("#DCE3E8")));

            // 2F classroom windows, some lit in the evening
            float[] xs = { -5.4f, -2.7f, 0f, 2.7f, 5.4f };
            for (int i = 0; i < xs.Length; i++)
            {
                Make("Window 2F", Shape.Cube, s, new Vector3(xs[i], 5.5f, 3.97f), new Vector3(2f, 1.6f, 0.08f), i % 2 == 0 ? glassLit : glass);
                Make("Sill", Shape.Cube, s, new Vector3(xs[i], 4.65f, 3.9f), new Vector3(2.2f, 0.1f, 0.2f), trim);
                Make("Mullion", Shape.Cube, s, new Vector3(xs[i], 5.5f, 3.92f), new Vector3(0.06f, 1.6f, 0.04f), frame);
            }
            // 1F windows beside the entrance
            foreach (var x in new[] { -5.2f, -3.2f, 3.2f, 5.2f })
            {
                Make("Window 1F", Shape.Cube, s, new Vector3(x, 1.8f, 3.97f), new Vector3(1.6f, 1.5f, 0.08f), Mathf.Abs(x) < 4 ? glassLit : glass);
                Make("Sill", Shape.Cube, s, new Vector3(x, 1.0f, 3.9f), new Vector3(1.8f, 0.1f, 0.2f), trim);
            }

            // Entrance: glass doors, canopy and the main sign
            Make("Entrance doors", Shape.Cube, s, new Vector3(0, 1.3f, 3.97f), new Vector3(2.4f, 2.6f, 0.08f), glassLit);
            Make("Door split", Shape.Cube, s, new Vector3(0, 1.3f, 3.92f), new Vector3(0.06f, 2.6f, 0.04f), frame);
            Make("Canopy", Shape.Cube, s, new Vector3(0, 2.85f, 3.35f), new Vector3(3.8f, 0.2f, 1.4f), trim);
            Make("Step", Shape.Cube, s, new Vector3(0, 0.08f, 3.6f), new Vector3(3.2f, 0.16f, 0.9f), Mat("Step", C("#CFC6B6"), outline: 0.002f));

            var sign = Group("Main sign", s, new Vector3(0, 3.4f, 3.9f)).transform;
            Make("Board", Shape.Cube, sign, Vector3.zero, new Vector3(5.4f, 0.75f, 0.1f), Mat("Sign navy", C("#1D2B4A")));
            Make("Light strip", Shape.Cube, sign, new Vector3(0, 0.42f, -0.12f), new Vector3(5.2f, 0.06f, 0.12f), Mat("Sign light", C("#FFF4D8"), C("#FFE7B0") * 3f, 0f, 0));
            Text("日本語学校", sign, new Vector3(0, 0, -0.07f), 0.055f, Color.white);
            PointLight(sign, new Vector3(0, 0.6f, -0.8f), C("#FFE2B0"), 0.45f, 3.5f);

            // A poster by the door: 生徒募集中 (now accepting students)
            var poster = Group("Poster", s, new Vector3(-1.8f, 1.75f, 3.93f)).transform;
            Make("Paper", Shape.Cube, poster, Vector3.zero, new Vector3(0.75f, 1.0f, 0.03f), Mat("Poster paper", C("#FFF7EC"), outline: 0.002f));
            Make("Sakura stripe", Shape.Cube, poster, new Vector3(0, 0.38f, -0.02f), new Vector3(0.75f, 0.22f, 0.02f), Mat("Sakura pink", C("#F4A9BE"), outline: 0));
            Text("生徒\n募集中", poster, new Vector3(0, -0.1f, -0.03f), 0.034f, C("#1D2B4A"), 0.9f);

            // Potted plants by the door
            foreach (var x in new[] { -1.6f, 1.6f })
            {
                Make("Pot", Shape.Cylinder, s, new Vector3(x, 0.22f, 3.45f), new Vector3(0.42f, 0.2f, 0.42f), Mat("Terracotta", C("#C9744F")));
                Make("Plant", Shape.Sphere, s, new Vector3(x, 0.68f, 3.45f), new Vector3(0.6f, 0.62f, 0.6f), Mat("Leaf green", C("#6FB25A")));
            }
        }

        static void BuildGate(Transform world)
        {
            var g = Group("School gate 校門", world).transform;
            var stone = Mat("Gate stone", C("#CFC8BC"));
            Make("Wall left", Shape.Cube, g, new Vector3(-4.4f, 0.6f, 0.6f), new Vector3(5.6f, 1.1f, 0.3f), stone);
            Make("Wall right", Shape.Cube, g, new Vector3(4.4f, 0.6f, 0.6f), new Vector3(5.6f, 1.1f, 0.3f), stone);
            foreach (var x in new[] { -1.6f, 1.6f })
                Make("Gate pillar", Shape.Cube, g, new Vector3(x, 0.9f, 0.6f), new Vector3(0.6f, 1.75f, 0.6f), stone);
            // Wooden name plate, written top to bottom like real Japanese school gates
            var plate = Group("Name plate", g, new Vector3(-1.6f, 0.95f, 0.27f)).transform;
            Make("Wood", Shape.Cube, plate, Vector3.zero, new Vector3(0.42f, 1.35f, 0.05f), Mat("Light wood", C("#E2C49A"), outline: 0.002f));
            Text("日\n本\n語\n学\n校", plate, new Vector3(0, 0, -0.04f), 0.02f, C("#2A2230"), 0.95f);
        }

        static void BuildSakura(Transform world, Vector3 at)
        {
            var t = Group("Sakura tree 桜", world, at).transform;
            var bark = Mat("Bark", C("#7A5642"));
            var pink = Mat("Sakura", C("#F7B3C6"), outlineColor: C("#B5607A"));
            var pink2 = Mat("Sakura light", C("#FBD0DC"), outlineColor: C("#B5607A"));
            Make("Trunk", Shape.Cylinder, t, new Vector3(0, 1.5f, 0), new Vector3(0.38f, 1.5f, 0.38f), bark);
            Make("Branch", Shape.Cylinder, t, new Vector3(-0.5f, 2.9f, 0), new Vector3(0.18f, 0.7f, 0.18f), bark, new Vector3(0, 0, 40));
            Make("Branch", Shape.Cylinder, t, new Vector3(0.5f, 2.9f, 0.1f), new Vector3(0.16f, 0.65f, 0.16f), bark, new Vector3(0, 0, -45));
            var pinkDeep = Mat("Sakura deep", C("#EE93AE"), outlineColor: C("#B5607A"));
            (Vector3 p, float s, Material m)[] blobs =
            {
                (new Vector3(0, 4.0f, 0.2f), 1.5f, pink), (new Vector3(-1.1f, 3.6f, 0), 1.2f, pink2),
                (new Vector3(1.0f, 3.7f, 0.3f), 1.3f, pinkDeep), (new Vector3(0.3f, 4.8f, 0.4f), 1.2f, pink2),
                (new Vector3(-0.6f, 4.5f, -0.4f), 1.0f, pink), (new Vector3(0.8f, 4.5f, -0.5f), 1.0f, pink2),
                (new Vector3(-1.6f, 4.2f, 0.4f), 0.9f, pinkDeep), (new Vector3(1.7f, 4.3f, 0.2f), 0.9f, pink),
                (new Vector3(0, 3.4f, -0.6f), 1.0f, pinkDeep), (new Vector3(-0.3f, 5.3f, 0.1f), 0.8f, pink)
            };
            foreach (var b in blobs) Make("Blossoms", Shape.Sphere, t, b.p, Vector3.one * b.s, b.m);
            var petal = Mat("Petal", C("#F9C2D1"), outline: 0);
            var rnd = new System.Random(7);
            for (int i = 0; i < 26; i++)
            {
                var p = new Vector3((float)rnd.NextDouble() * 6 - 3, 0.03f, (float)rnd.NextDouble() * 4.2f - 3.6f);
                Make("Petal", Shape.Cylinder, t, p, new Vector3(0.12f, 0.005f, 0.09f), petal, new Vector3(0, rnd.Next(0, 180), 0));
            }
        }

        static void BuildVendingMachines(Transform world)
        {
            var g = Group("Vending machines 自販機", world).transform;
            (float x, string body)[] machines = { (-5.6f, "#D9443F"), (-4.5f, "#F2F2F0") };
            Color[] drinks = { C("#3A7BD5"), C("#F2A33A"), C("#5CB85C"), C("#E2574C"), C("#8E6E53"), C("#F4F4F4") };
            int k = 0;
            foreach (var (x, body) in machines)
            {
                var m = Group("Vending machine", g, new Vector3(x, 0.15f, 0.0f)).transform;
                Make("Body", Shape.Cube, m, new Vector3(0, 0.95f, 0), new Vector3(1.0f, 1.9f, 0.75f), Mat("Vending " + body.TrimStart('#'), C(body)));
                Make("Display", Shape.Cube, m, new Vector3(0, 1.32f, -0.38f), new Vector3(0.86f, 0.95f, 0.03f),
                    Mat("Vending display", C("#F4F8FF"), C("#E8F2FF") * 1.2f, 0.3f, 0));
                for (int row = 0; row < 3; row++)
                    for (int col = 0; col < 5; col++)
                    {
                        var c = drinks[(k++ * 7 + row) % drinks.Length];
                        Make("Drink", Shape.Cube, m, new Vector3(-0.32f + col * 0.16f, 1.05f + row * 0.3f, -0.41f),
                            new Vector3(0.1f, 0.2f, 0.03f), Mat("Drink " + ColorUtility.ToHtmlStringRGB(c), c, outline: 0));
                        Make("Button", Shape.Cube, m, new Vector3(-0.32f + col * 0.16f, 0.92f + row * 0.3f, -0.41f),
                            new Vector3(0.07f, 0.03f, 0.02f), Mat("Button lit", C("#7DDB6A"), C("#7DDB6A") * 1.5f, 0.2f, 0));
                    }
                Make("Slot", Shape.Cube, m, new Vector3(0, 0.35f, -0.38f), new Vector3(0.7f, 0.25f, 0.03f), Mat("Slot dark", C("#2E2F38"), outline: 0));
                PointLight(m, new Vector3(0, 1.3f, -0.9f), C("#DCEBFF"), 0.5f, 2.6f);
            }
        }

        static void BuildBicycle(Transform world, Vector3 at)
        {
            var b = Group("Bicycle 自転車 (mamachari)", world, at).transform;
            var tire = Mat("Tire", C("#2F3038"));
            var frame = Mat("Bike mint", C("#6CC3B0"));
            var metal = Mat("Metal", C("#B8BDC6"));
            foreach (var x in new[] { -0.52f, 0.52f })
            {
                Make("Tire", Shape.Cylinder, b, new Vector3(x, 0.33f, 0), new Vector3(0.66f, 0.02f, 0.66f), tire, new Vector3(90, 0, 0));
                Make("Spokes", Shape.Cylinder, b, new Vector3(x, 0.33f, 0), new Vector3(0.54f, 0.03f, 0.54f), Mat("Spokes", C("#DDE2EA"), outline: 0), new Vector3(90, 0, 0));
                Make("Hub", Shape.Cylinder, b, new Vector3(x, 0.33f, 0), new Vector3(0.12f, 0.04f, 0.12f), metal, new Vector3(90, 0, 0));
            }
            Make("Down tube", Shape.Cube, b, new Vector3(0.05f, 0.55f, 0), new Vector3(0.8f, 0.06f, 0.06f), frame, new Vector3(0, 0, -30));
            Make("Seat tube", Shape.Cube, b, new Vector3(-0.22f, 0.62f, 0), new Vector3(0.06f, 0.6f, 0.06f), frame, new Vector3(0, 0, -15));
            Make("Seat", Shape.Cube, b, new Vector3(-0.28f, 0.95f, 0), new Vector3(0.26f, 0.06f, 0.12f), tire);
            Make("Fork", Shape.Cube, b, new Vector3(0.48f, 0.68f, 0), new Vector3(0.06f, 0.75f, 0.06f), frame, new Vector3(0, 0, 15));
            Make("Handlebar", Shape.Cube, b, new Vector3(0.42f, 1.05f, 0), new Vector3(0.06f, 0.06f, 0.5f), metal);
            Make("Basket", Shape.Cube, b, new Vector3(0.68f, 0.92f, 0), new Vector3(0.32f, 0.24f, 0.36f), metal);
        }

        static void BuildStreetLamp(Transform world, Vector3 at)
        {
            var l = Group("Street lamp", world, at).transform;
            var pole = Mat("Lamp pole", C("#6E7484"));
            Make("Pole", Shape.Cylinder, l, new Vector3(0, 2.3f, 0), new Vector3(0.14f, 2.3f, 0.14f), pole);
            Make("Arm", Shape.Cube, l, new Vector3(0.4f, 4.55f, 0), new Vector3(0.85f, 0.08f, 0.08f), pole);
            Make("Lamp", Shape.Cube, l, new Vector3(0.75f, 4.45f, 0), new Vector3(0.5f, 0.14f, 0.32f), Mat("Lamp glow", C("#FFF1D6"), C("#FFD9A0") * 4f, 0f, 0.002f));
            PointLight(l, new Vector3(0.75f, 4.0f, 0), C("#FFD8A6"), 0.8f, 6f);
        }

        static void BuildPowerLines(Transform world)
        {
            var g = Group("Power lines 電線", world).transform;
            var pole = Mat("Concrete pole", C("#A8A9A6"));
            var wire = Mat("Wire", C("#2C2A33"), outline: 0);
            foreach (var x in new[] { -12f, 13f })
            {
                Make("Pole", Shape.Cylinder, g, new Vector3(x, 4.6f, -2.3f), new Vector3(0.3f, 4.6f, 0.3f), pole);
                Make("Cross arm", Shape.Cube, g, new Vector3(x, 8.4f, -2.3f), new Vector3(0.12f, 0.12f, 1.8f), pole);
                Make("Transformer", Shape.Cylinder, g, new Vector3(x + 0.35f, 7.2f, -2.3f), new Vector3(0.45f, 0.4f, 0.45f), Mat("Transformer", C("#8C9396")));
            }
            foreach (var z in new[] { -3.0f, -2.3f, -1.6f })
                Make("Wire", Shape.Cube, g, new Vector3(0.5f, 8.45f, z), new Vector3(60, 0.025f, 0.025f), wire);
            Make("Wire", Shape.Cube, g, new Vector3(0.5f, 7.8f, -2.3f), new Vector3(60, 0.02f, 0.02f), wire);
        }

        // さくら書店 (bookshop) on the left: one of the look-alike signs from Day 1, Scene 4
        static void BuildBookshop(Transform world)
        {
            var g = Group("さくら書店 Bookshop", world, new Vector3(-11.6f, 0, 0)).transform;
            Make("Building", Shape.Cube, g, new Vector3(0, 3.2f, 5), new Vector3(8, 6.4f, 7), Mat("Bookshop wall", C("#BFD8E4")));
            Make("Shop front", Shape.Cube, g, new Vector3(0, 1.25f, 1.48f), new Vector3(6.2f, 2.3f, 0.08f),
                Mat("Shop glass lit", C("#8DB3CC"), C("#FFB45A") * 0.7f, 0f, 0.0025f));
            Make("Awning", Shape.Cube, g, new Vector3(0, 2.75f, 0.9f), new Vector3(6.6f, 0.12f, 1.3f), Mat("Awning green", C("#3E8E6E")), new Vector3(-12, 0, 0));
            var sign = Group("Sign", g, new Vector3(1.6f, 3.65f, 1.45f)).transform;
            Make("Board", Shape.Cube, sign, Vector3.zero, new Vector3(4.2f, 0.8f, 0.1f), Mat("Sign cream", C("#FFF6E2")));
            Text("さくら書店", sign, new Vector3(0, 0, -0.07f), 0.05f, C("#2E6B53"));
            PointLight(sign, new Vector3(0, 0.3f, -0.9f), C("#FFE6BE"), 0.4f, 3f);
            Make("Window 2F", Shape.Cube, g, new Vector3(-1.5f, 5f, 1.48f), new Vector3(1.6f, 1.2f, 0.08f), Mat("Window glass", C("#7FA8C9"), outline: 0.0025f));
            Make("Window 2F", Shape.Cube, g, new Vector3(1.5f, 5f, 1.48f), new Vector3(1.6f, 1.2f, 0.08f), Mat("Window glass lit", C("#7FA8C9"), C("#FFB45A") * 0.75f, 0f, 0.0025f));
        }

        // くらや (a small shop with a noren curtain and a red lantern) on the right
        static void BuildKuraya(Transform world)
        {
            var g = Group("くらや Shop", world, new Vector3(11.6f, 0, 0)).transform;
            Make("Building", Shape.Cube, g, new Vector3(0, 2.6f, 5), new Vector3(8, 5.2f, 7), Mat("Wood wall", C("#B07A55")));
            Make("Roof", Shape.Cube, g, new Vector3(0, 3.0f, 1.0f), new Vector3(8.4f, 0.2f, 1.5f), Mat("Roof tiles", C("#4D5468")), new Vector3(-18, 0, 0));
            Make("Doorway", Shape.Cube, g, new Vector3(-0.8f, 1.15f, 1.48f), new Vector3(2.2f, 2.2f, 0.08f),
                Mat("Warm doorway", C("#E8C9A0"), C("#FFB070") * 0.6f, 0.1f, 0.0025f));
            var noren = Mat("Noren indigo", C("#2C3E73"));
            for (int i = 0; i < 4; i++)
                Make("Noren", Shape.Cube, g, new Vector3(-1.55f + i * 0.5f, 2.0f, 1.4f), new Vector3(0.46f, 0.75f, 0.03f), noren);
            Text("くらや", g, new Vector3(-0.8f, 2.0f, 1.36f), 0.04f, Color.white);
            var lantern = Mat("Lantern red", C("#E04B3A"), C("#FF7A4A") * 2.2f, 0f);
            Make("Lantern", Shape.Sphere, g, new Vector3(1.0f, 1.9f, 1.15f), new Vector3(0.45f, 0.6f, 0.45f), lantern);
            Make("Lantern cap", Shape.Cylinder, g, new Vector3(1.0f, 2.22f, 1.15f), new Vector3(0.3f, 0.04f, 0.3f), Mat("Lantern black", C("#2A2630")));
            PointLight(g, new Vector3(1.0f, 1.9f, 0.6f), C("#FF9A6A"), 0.6f, 3f);
            Make("Window", Shape.Cube, g, new Vector3(2.4f, 1.4f, 1.48f), new Vector3(1.4f, 1.1f, 0.08f), Mat("Window glass lit", C("#7FA8C9"), C("#FFB45A") * 0.75f, 0f, 0.0025f));
        }

        static void BuildSkyline(Transform world)
        {
            var g = Group("Far buildings", world).transform;
            (Vector3 p, Vector3 s, string c)[] b =
            {
                (new Vector3(-22, 6, 34), new Vector3(8, 12, 6), "#C6CEDC"), (new Vector3(-9, 4.5f, 38), new Vector3(9, 9, 6), "#D8D2DE"),
                (new Vector3(5, 7, 36), new Vector3(7, 14, 6), "#C9D6E0"), (new Vector3(17, 5, 33), new Vector3(9, 10, 6), "#D6CFC6"),
                (new Vector3(28, 6.5f, 37), new Vector3(8, 13, 6), "#C4CCD8")
            };
            foreach (var x in b) Make("Building", Shape.Cube, g, x.p, x.s, Mat("Far " + x.c.TrimStart('#'), C(x.c), outline: 0.0015f));
        }

        // Simple stand-in characters until the VRoid models arrive
        static void BuildPerson(Transform parent, string name, Vector3 at, Color clothes, Color hair, float yaw)
        {
            var p = Group(name, parent, at).transform;
            p.localEulerAngles = new Vector3(0, yaw, 0);
            Make("Body", Shape.Capsule, p, new Vector3(0, 0.62f, 0), new Vector3(0.5f, 0.62f, 0.4f), Mat("Clothes " + name, clothes));
            Make("Head", Shape.Sphere, p, new Vector3(0, 1.48f, 0), Vector3.one * 0.5f, Mat("Skin", C("#F7D9C4")));
            Make("Hair", Shape.Sphere, p, new Vector3(0, 1.6f, 0.07f), new Vector3(0.53f, 0.36f, 0.5f), Mat("Hair " + name, hair));
            var eye = Mat("Eye", C("#2B2638"), outline: 0);
            foreach (var x in new[] { -0.09f, 0.09f })
                Make("Eye", Shape.Sphere, p, new Vector3(x, 1.47f, -0.24f), new Vector3(0.06f, 0.09f, 0.03f), eye);
        }
    }
}
