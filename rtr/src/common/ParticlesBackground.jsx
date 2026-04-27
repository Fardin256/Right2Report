import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1
      }}
      options={{
        fpsLimit: 60,

        background: {
          color: {
            value: "#0f172a"
          }
        },

        particles: {
          number: {
            value: 70,
            density: {
              enable: true,
              area: 800
            }
          },

          color: {
            value: "#22C55E"
          },

          links: {
            enable: true,
            distance: 150,
            color: "#22C55E",
            opacity: 0.4,
            width: 1
          },

          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: {
              default: "bounce"
            }
          },

          size: {
            value: { min: 1, max: 4 }
          },

          opacity: {
            value: 0.5
          }
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },

          modes: {
            repulse: {
              distance: 120,
              duration: 0.4
            }
          }
        },

        detectRetina: true
      }}
    />
  );
}






// import { useCallback } from "react";
// import Particles from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";

// export default function ParticlesBackground() {

//   const particlesInit = useCallback(async (engine) => {
//     await loadSlim(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         zIndex: -1
//       }}
//       options={{
//         background: {
//           color: {
//             value: "#0f172a"
//           }
//         },

//         particles: {
//           number: {
//             value: 60
//           },

//           color: {
//             value: "#22C55E"
//           },

//           links: {
//             enable: true,
//             color: "#22C55E",
//             distance: 150,
//             opacity: 0.4
//           },

//           move: {
//             enable: true,
//             speed: 0.7
//           },

//           size: {
//             value: 3
//           },

//           opacity: {
//             value: 0.5
//           }
//         },

//         interactivity: {
//           events: {
//             onHover: {
//               enable: true,
//               mode: "repulse"
//             }
//           },

//           modes: {
//             repulse: {
//               distance: 120
//             }
//           }
//         }
//       }}
//     />
//   );
// }

















// import React, { useCallback } from "react";
// import Particles from "@tsparticles/react";
// import { loadFull } from "tsparticles";

// export default function ParticlesBackground() {

//   const particlesInit = useCallback(async (engine) => {
//     await loadFull(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         zIndex: -1
//       }}
//       options={{
//         background: {
//           color: "#0f172a"
//         },

//         particles: {
//           number: {
//             value: 60
//           },

//           color: {
//             value: "#22C55E"
//           },

//           links: {
//             enable: true,
//             color: "#22C55E",
//             distance: 150,
//             opacity: 0.4
//           },

//           move: {
//             enable: true,
//             speed: 0.7
//           },

//           size: {
//             value: 3
//           },

//           opacity: {
//             value: 0.5
//           }
//         },

//         interactivity: {
//           events: {
//             onHover: {
//               enable: true,
//               mode: "repulse"
//             }
//           },

//           modes: {
//             repulse: {
//               distance: 120
//             }
//           }
//         }
//       }}
//     />
//   );
// }