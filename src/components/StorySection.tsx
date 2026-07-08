import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function StorySection() {
  return (
    <section id="story" className="scroll-mt-20 bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <SectionHeading
            urduAccent="ہماری کہانی"
            title="Why “Chaye 25 Hai”?"
          />
          <div className="space-y-5 text-lg leading-relaxed text-cream/90">
            <p>
              The name is the founding promise:{" "}
              <strong className="text-chai">chai is 25 rupees</strong>. When
              this shop opened its shutters in Yaseenabad, a proper cup of
              doodh patti went for twenty-five rupees — and the name stuck to
              the wall before the paint dried.
            </p>
            <p>
              Prices in Karachi haven&apos;t stood still, but the idea has:
              chai should be honest. Full milk, real patti, brewed slow on the
              flame — never reheated, never rushed, never dressed up to cost
              more than it should.
            </p>
            <p>
              And because this city doesn&apos;t sleep, neither do we. Exam
              night, night shift, cricket till 3 AM, or just a long drive that
              needed one more stop — the kettle at Shamim Skyline stays on{" "}
              <strong className="text-chai">24 hours a day</strong>. Come at 2
              AM and you&apos;ll find the tawa hot and the benches full.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
