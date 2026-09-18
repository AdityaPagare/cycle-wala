import Nav from "@/components/layout/Nav";
import Scene from "@/components/layout/Scene";
import Hero from "@/components/sections/Hero/Hero";
import About from "@/components/sections/About/About";
import Shop from "@/components/sections/Shop/Shop";
import Services from "@/components/sections/Services/Services";
import Support from "@/components/sections/Support/Support";
import Gallery from "@/components/sections/Gallery/Gallery";
import Connect from "@/components/sections/Connect/Connect";

/*
 * A simple, static site: Hero, About, Shop, Services and Support are plain
 * sections in normal document flow — no scroll-jacking, no pinning. Gallery
 * is the one exception, kept exactly as it was: it still rides the sticky
 * Scene stack (see components/layout/Scene.tsx) so its drift-wall behaviour
 * is unchanged. Connect closes the page and rises over the Gallery scene.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shop />
        <About />
        <Services />
        <Support />

        <Scene order={1} runway={1.6} id="gallery" keepOnMobile>
          <Gallery />
        </Scene>

        <div className="finalFrame">
          <Connect />
        </div>
      </main>
    </>
  );
}
