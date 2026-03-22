export type MockProjectScene = {
  id: string
  name: string
  prompt: string
  contextText: string
  motionPreset: string
  motionIntensity: number
  status: string
  image: string
}

export type MockProject = {
  id: string
  title: string
  status: string
  updatedAt: string
  globalContext: string
  scenes: MockProjectScene[]
}

export const mockProjects: MockProject[] = [
  {
    id: "mock-amalfi-coast",
    title: "Sunset over Amalfi Coast",
    status: "draft",
    updatedAt: "2026-03-20T16:00:00.000Z",
    globalContext: "A cinematic journey along the Italian coast during summer sunset.",
    scenes: [
      {
        id: "mock-amalfi-scene-1",
        name: "Scene One",
        prompt:
          "Deep golden hour, volumetric lighting, slight mist over the Mediterranean, hyper-realistic parallax depth.",
        contextText: "Golden-hour terraces glow over the sea with layered depth and soft atmospheric haze.",
        motionPreset: "Cinematic Push",
        motionIntensity: 75,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA_v-7Nh0QR3utisJ4w0r88BIYx6IX78iUm2k3BMD86cmSlRTdr5eWbAyhuKJ4pDUQirkcRuzuZlD5A-0SNcnb_WGptKr-awW7jdxRTEFfw-uPrba4BVBgHvWKqfC7SvrZWCV_acNlnP2hkO6nE97djfCQFR_acNEzp2pIHXiU0QYv6buWNgUhDVbcOumCH_rFHYY65iOXfETauR6Yw7r5uvBSgTxPlGBt905IT-f2d47QmVmTnV55IcjdUcyMZtIvLO8_3eF78Amk",
      },
      {
        id: "mock-amalfi-scene-2",
        name: "Scene Two",
        prompt:
          "Cliffside terraces glow with warm sunset spill, layered buildings fade into sea haze, cinematic depth with gentle foreground separation.",
        contextText: "Terraced architecture slides past with a calm pan and layered foreground separation.",
        motionPreset: "Standard Pan",
        motionIntensity: 62,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBC3dtqQy_lVoORXf1yBbnAOOqeaBf6bs6JwxEAzRDFNWCpX8kXDYQC1a99tV4KYkWikGeuF-QzGRSooLvwtx8E3YIVF96zreFVRROsNNlUrofALxc1TgYbR3uLmBnZNQZ9_8u7T5bDqOIXN7uoNcA28iwesQUDKsIrYhqqk5BvZjjmQ1uYZfbE1lxVC9Tle7SvogoRfgyiXGQLIrBanEAOLcpSHAPLjHD0Lj79s-YmjqWHgCEIHRJ0LbbR5HqAPbdutl8_a2Ov2zE",
      },
      {
        id: "mock-amalfi-scene-3",
        name: "Scene Three",
        prompt:
          "A brighter harbor-facing angle with coastal reflections, soft atmosphere, and a calmer pace that emphasizes background depth.",
        contextText: "The harbor opens into a brighter final frame with reflections and slower pacing.",
        motionPreset: "Vertical Scroll",
        motionIntensity: 54,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD2SxaPbl5i3BcVyyiWZNME517Bb-fffNbkD-ZvkG7ZRf84QHhIDb5Iu4_HfiEYFvS87swKjMjAF6d3eyBKhbsk8gPU2yKnGrLaLoQ82wwBksubmTnlzkH3NZr7uPjqDEjfdOrzRCoZVqEaueawTUGPTOI4VdCH4gnyRthtCWDNB2NoReLeCZEMWW8DjPAfw4vRXt5_Jni-haCglUyMBli2-BFT1JLTdiAPTewxLVWNyNXXHOrz8B8WmxqUMqxs9zeIwQBnHFkUk64",
      },
    ],
  },
  {
    id: "mock-neon-district",
    title: "Neon District 2077",
    status: "ready",
    updatedAt: "2026-03-20T12:00:00.000Z",
    globalContext: "A rain-soaked cyberpunk promenade lit by holograms, reflections, and elevated transit lines.",
    scenes: [
      {
        id: "mock-neon-scene-1",
        name: "Arrival",
        prompt: "Street-level approach through neon haze with holographic signage and wet asphalt reflections.",
        contextText: "An opening descent through electric haze and reflective streets.",
        motionPreset: "Cinematic Push",
        motionIntensity: 68,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBoFq8kkz8XD3_sHKB4gbYv7biPF8GIE7kB6LO0hdVOty_oErCp79YiiIXxT5Um5XN0aLD5pa-tfNFL3T4CLTdKZ4tnAVsDOmVFPzhXIejL0Ti_7a-grst3W-t1vYMNqHmHdmgZ9X661JBBo8csic6KhfwbqwlmYMsuolpwbCKM6SKFcM0gQBoY2gbEH6yy-cm0Udj9SO6ev1YNAdl2pps9volpI1vXPb46skf8BFfDjsJnJfgQH5ejkWp5-m2ybsSZs0B8XOjPoKs",
      },
      {
        id: "mock-neon-scene-2",
        name: "Skybridge",
        prompt: "Elevated crosswalk overlooking the district with layered traffic trails and digital billboards.",
        contextText: "The camera floats into a skybridge reveal above the city pulse.",
        motionPreset: "Standard Pan",
        motionIntensity: 58,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCBW5wzJSHcAEggO2RYApU0PRnjWdyvBLXYfVfHK4flfPwMOaAZiwtIBuRZRJauseEfSlhK0TS6eHIeVOD9hGUIZsGpI4PYbqJneCK9zGBw9BMDuOJHrnmiEksL064I3nES0IPl8aF_fDmtUXC4iEQDLcHXQTuMQpjrfCppPou9Tbijdta9YZXYw3rjVfbgKsFsbw6PdN3kFBhwSz_hPWIYP2ZzejAk9u3QvmjgrUGFbXerUhR7SgwH-vbJI4LYoXx240AHQ76sBnw",
      },
      {
        id: "mock-neon-scene-3",
        name: "Final Glow",
        prompt: "Wide establishing shot as mist parts and the city core radiates with deep color contrast.",
        contextText: "A wide final reveal gives the district a glowing cinematic finish.",
        motionPreset: "Vertical Scroll",
        motionIntensity: 49,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD3rh2vc_ShENc9RR_DKqjTjm7lr3qV8bcmDPF6bcny9sy0G87IlhAn86umMKi8EKUAOaga6d4J2OY1CwPZ4a-WEfhl_V6xUkxMyopMI3-caa-9Cd1TK5SdyARlwz2r-IyZZasdA2DcQHaxGOjlcxXsUNMfIYgRh_tZi8NPkG2p22LU-hh7kVhiQ8q2QD1lyKx3pq7MMHpkrCJwV4AMbPNn5Hr0aiUrCCIiIJI5RDVPicGe_LM04tsHDImJnTn9olHtHfCYhnq7EQE",
      },
    ],
  },
  {
    id: "mock-desert-mirage",
    title: "Desert Mirage",
    status: "in_review",
    updatedAt: "2026-03-19T18:30:00.000Z",
    globalContext: "A sun-baked desert passage with monumental silhouettes, heat haze, and patient vertical movement.",
    scenes: [
      {
        id: "mock-desert-scene-1",
        name: "Dune Rise",
        prompt: "Low-angle dune crest with heat distortion and long shadows sweeping across the sand.",
        contextText: "The story opens with a slow rise over sculpted dunes and heat shimmer.",
        motionPreset: "Cinematic Push",
        motionIntensity: 60,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBjHqqSUJGnNViyVkKel9HZFklvYP7NR4rAq396D1PziqpLKA6rYsGdblMWwlWfbSSffp-tLLoV_3E9LOP5tnnxTyAwfOCyII4AEZ-AI4KjHcoUiwfzOc87Cepq7vZKKb6rfhgV3t_wlNFegZZYZPIPsBtw6WtPssKM7TUvEHD4cKgeuE_UA4J2UhxDDNXYg-9CcsjXVk7g96CXr5CLJNzdgPk1tdFm5JSK-ApQ5kSrQz_Vj17zSKbYcsQBbyY1utKQ75qHq399LYg",
      },
      {
        id: "mock-desert-scene-2",
        name: "Stone Gate",
        prompt: "Ancient desert architecture emerges through dust with layered foreground rock forms.",
        contextText: "A stone gateway appears through suspended dust and carved rock depth.",
        motionPreset: "Standard Pan",
        motionIntensity: 47,
        status: "ready",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuArYAKv1sP9E8dctg89nU6-KbyG5P9M5j7CSARHJ-8-OJzvTV5f0goKUEtGvSgLj5fkT1S5d5_r7qkJ-5p0x1N0O2N2cv-HjIgAnXU3UK0A3vLxZcGUEQd6Em9q0R2lQim2OtS6zOG8hY4qT6mSYgX3VT_0LIW4kMX9l0oM5r4n9Q2N3K2c2Pjlwm0r7k2Nq1aL7xvP0-4Eq8Gqv9Q",
      },
    ],
  },
]

export function getMockProjectById(projectId: string) {
  return mockProjects.find((project) => project.id === projectId) ?? null
}

export function isMockProjectId(projectId: string) {
  return getMockProjectById(projectId) !== null
}
