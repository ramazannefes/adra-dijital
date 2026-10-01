import { Scene01Intro } from "@/components/scenes/Scene01Intro";
import { Scene02Statement } from "@/components/scenes/Scene02Statement";
import { Scene03DigitalWorld } from "@/components/scenes/Scene03DigitalWorld";
import { Scene04Web } from "@/components/scenes/Scene04Web";
import { Scene05Brand } from "@/components/scenes/Scene05Brand";
import { Scene06Growth } from "@/components/scenes/Scene06Growth";
import { Scene07AI } from "@/components/scenes/Scene07AI";
import { Scene08System } from "@/components/scenes/Scene08System";
import { Scene09Work } from "@/components/scenes/Scene09Work";
import { Scene10Process } from "@/components/scenes/Scene10Process";
import { Scene11CTA } from "@/components/scenes/Scene11CTA";

/**
 * ANA DENEYİM — sinematik timeline.
 * Sahne 01 intro overlay (fixed) · 02–11 scroll sahnesi · 12 footer layout'ta.
 * Her sahne kendi dosyasında; bu kompozisyon Server Component'tir.
 */
export default function HomePage() {
  return (
    <>
      <Scene01Intro />
      <Scene02Statement />
      <Scene03DigitalWorld />
      <Scene04Web />
      <Scene05Brand />
      <Scene06Growth />
      <Scene07AI />
      <Scene08System />
      <Scene09Work />
      <Scene10Process />
      <Scene11CTA />
    </>
  );
}
