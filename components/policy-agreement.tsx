"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { PolicyAgreements } from "@/lib/types"

interface PolicyAgreementProps {
  onComplete: (agreements: PolicyAgreements) => void
  onBack: () => void
}

export default function PolicyAgreement({ onComplete, onBack }: PolicyAgreementProps) {
  const [agreements, setAgreements] = useState<PolicyAgreements>({
    readPolicy: false,
    understandQuestions: false,
    acknowledgeBehavior: false,
    understandAdmission: false,
    understandReporting: false,
    understandInvestigation: false,
    signatureAgreement: false,
  })

  const allAgreed = Object.values(agreements).every((val) => val === true)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-[var(--nec-border)] bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-xl font-bold text-white mb-4">NECYPAA Non-Discrimination and Anti-Harassment Policy</h3>
        <div className="prose prose-invert max-w-none text-gray-300 space-y-4 max-h-96 overflow-y-auto text-sm">
          <p>
            The North East Convention of Young People in Alcoholics Anonymous (NECYPAA) adheres to the spiritual
            principles of Alcoholics Anonymous ("AA"), its 12 Steps, Traditions, and Concepts. NECYPAA is committed to
            an environment that is free of discrimination and harassment, including sexual harassment. To this end,
            NECYPAA requires the NECYPAA Advisory Council ("Advisory Council"), NECYPAA Host Committee ("Host
            Committee") members, Bid Committee members, attendees of the annual conference or events, and all
            participants in NECYPAA-operated or -moderated websites, internet forums or social media pages (including
            but not limited to: necypaa.org, the private NECYPAA Facebook group and Facebook groups maintained by the
            Host & Advisory Committees) to adhere to this Policy.
          </p>

          <h4 className="text-white font-semibold mt-4">NON-DISCRIMINATION POLICY</h4>
          <p>
            NECYPAA expressly prohibits any form of discrimination by or against its Advisory Council Members, Host
            Committee members, Bid Committee members, or attendees of the annual conference or events, and all
            participants in NECYPAA-operated or -moderated websites, internet forums or social media pages, based on
            age, race, color, religion, sex, national origin, creed, disability, veteran's status, sexual orientation,
            gender identity or gender expression. Discrimination is adverse treatment of any individual based on their
            said protected attribute, rather than on the basis of the individual's merit.
          </p>

          <h4 className="text-white font-semibold mt-4">ANTI-HARASSMENT POLICY</h4>
          <p>
            NECYPAA expressly prohibits any form of harassment or sexual harassment by or against any Advisory Council
            members, Host Committee members, Bid Committee members, conference attendees, and all participants in
            NECYPAA-operated or -moderated websites, Internet forums or social media pages. Harassment is unwelcome or
            unwanted conduct, whether verbal, physical or visual, toward an individual because of the individual's age,
            race, color, religion, sex, national origin, creed, disability, veteran's status, sexual orientation, gender
            identity or gender expression, when the conduct creates an intimidating, hostile or offensive environment.
            Sexual harassment is conduct by an individual which makes or subjects any person to unwelcome sexual
            advances, unwelcome requests for sexual favors, or engages in any other unwelcome verbal or physical conduct
            of a sexual nature, where (1) submission to or rejection of such conduct by an individual is used as the
            basis for decisions affecting that individual, or (2) such conduct has the purpose or effect of unreasonably
            interfering with an individual's experience by creating an intimidating, hostile, or offensive environment.
          </p>

          <p>
            Determining what constitutes sexual harassment depends upon the specific facts and the context in which the
            conduct occurs. Sexual harassment may take many forms-subtle and indirect, or blatant and overt. For
            example:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>It may be conduct toward an individual of any sex or gender.</li>
            <li>It may occur between peers or between individuals in a superior/subordinate relationship.</li>
            <li>It may be aimed at coercing an individual to participate in an unwanted sexual relationship.</li>
            <li>
              It may consist of repeated actions or may arise from only a single incident if sufficiently serious.
            </li>
          </ul>

          <h4 className="text-white font-semibold mt-4">
            NON-DISCRIMINATION AND ANTI-HARASSMENT ENFORCEMENT GUIDELINES
          </h4>
          <p>
            Discrimination, harassment, and sexual harassment are unacceptable at NECYPAA's annual conference and all
            related events, and on NECYPAA operated or moderated websites, internet forums and social media pages.
            Instances of discrimination, harassment, and sexual harassment violate this Policy even when they do not
            constitute a violation of law.
          </p>

          <h4 className="text-white font-semibold mt-4">Reporting</h4>
          <p>
            Advisory Council members, Host Committee members, Bid Committee members, conference attendees, and
            participants in NECYPAA-operated or -moderated websites, internet forums, and social media pages should help
            assure NECYPAA and all related events are free from discrimination and harassment. Anyone who feels that
            they are being subjected to discrimination, harassment, or sexual harassment should immediately request the
            person engaging in such behavior to stop, and should promptly report the behavior to any member of the
            Advisory Council or Host Committee. If the matter is not resolved to the individual's satisfaction by
            informal action, they may pursue a complaint in writing. If at any time an Advisory Council member, Host
            Committee member, Bid Committee member, or attendee believes they have been a victim of or witness to a
            crime, the police should be notified directly.
          </p>

          <p>
            Any Advisory Council or Host Committee member who is aware of or who receives a report of conduct which
            violates this Policy is required to report immediately to the NECYPAA Advisory Council Operating Committee
            ("Operating Committee"). If an incident occurs in clear violation of the law, the Operating Committee shall
            notify the police directly.
          </p>

          <h4 className="text-white font-semibold mt-4">Retaliation</h4>
          <p>
            No individual will be subject to, and it is the NECYPAA's policy to strictly prohibit, any form of
            discipline or retaliation for reporting incidents of discrimination, harassment, or sexual harassment, or
            for pursuing with NECYPAA or the appropriate governmental agency or otherwise any claim of discrimination,
            harassment, or sexual harassment.
          </p>

          <h4 className="text-white font-semibold mt-4">Disciplinary or Corrective Action</h4>
          <p>
            When an investigation reveals a violation of this Policy has occurred the Advisory Council must take
            corrective action. Upon a finding of discrimination, harassment, or sexual harassment, the Advisory Council
            will take disciplinary or corrective action that it deems appropriate, in its sole discretion, under the
            circumstances. Disciplinary or corrective action may include, for example, termination, removal, dismissal,
            or prohibition from attending future NECYPAA conferences, events, and/or participation in NECYPAA-operated
            or -moderated websites, internet forums or social media groups. Discrimination, harassment, or sexual
            harassment need not amount to a criminal violation to be disciplined under this Policy.
          </p>

          <h4 className="text-white font-semibold mt-4">Confidentiality</h4>
          <p>
            NECYPAA recognizes that confidentiality is important. Those responsible for implementing this Policy will
            respect the confidentiality and privacy of individuals reporting or accused of discrimination, harassment,
            or sexual harassment to the extent reasonably possible. Examples of situations where confidentiality cannot
            be maintained include circumstances when NECYPAA is required by law to disclose information (such as in
            response to legal process) and when disclosure is required by NECYPAA's outweighing interest in protecting
            the rights of others.
          </p>

          <p>
            For questions, concerns, and reporting of incidents please report to the Chair, or Co Chair or anyone on
            NECYPAA advisory.
          </p>

          <h4 className="text-white font-semibold mt-4">SAFETY CARD FOR A.A. GROUPS</h4>
          <p className="text-xs italic">
            (The General Service Office has made this optional statement available as an A.A. service piece for those
            groups who wish to use it.)
          </p>

          <h5 className="text-white font-semibold mt-3">Suggested Statement on Safety</h5>
          <p>
            Our group endeavors to provide a safe meeting place for all attendees and encourages each person here to
            contribute to fostering a secure and welcoming environment in which our meetings can take place. As our
            Traditions remind us, the formation and operation of an A.A. group resides with the group conscience.
            Therefore, we ask that group members and others refrain from any behavior which might compromise another
            person's safety. Also, please take the precautions you feel are necessary to ensure your own personal
            safety, for example, walking to your car in a group after a meeting. If a situation should arise where
            someone feels their safety is in jeopardy, or the situation breaches the law, the individuals involved
            should take appropriate action. Calling the proper authorities does not go against any A.A. Traditions and
            is recommended when someone may have broken the law or endangered the safety of another person.
          </p>

          <h4 className="text-white font-semibold mt-4">Our Common Welfare</h4>
          <p className="italic">
            Each member of Alcoholics Anonymous is but a small part of a great whole. A.A. must continue to live or most
            of us will surely die. Hence our common welfare comes first. But individual welfare follows close afterward.
            —Tradition One (Long Form)
          </p>

          <p>
            It is hoped that our common suffering as alcoholics and our common solution in A.A. will transcend most
            issues and curtail negative behaviors that could jeopardize the safety of anyone attending an A.A. meeting.
            Nevertheless, Alcoholics Anonymous is a microcosm of the larger society we exist in. As such, problems found
            in the outside world can also make their way into the rooms of A.A. For this reason, groups and members
            discuss the topic of safety — to raise awareness in the Fellowship and to seek through sponsorship,
            workshops and meetings, to create as safe an environment as possible to carry A.A.'s message of hope and
            recovery to the still-suffering alcoholic.
          </p>
        </div>
      </div>

      <div className="space-y-4">
<p className="text-white font-semibold">
          Attendees must check each box in order to be allowed admission to the NECYPAA convention.{" "}
          <span className="text-pink-400" aria-hidden="true">*</span>
        </p>
        <p className="text-sm text-gray-500"><span className="text-pink-400" aria-hidden="true">*</span> <span className="sr-only">Asterisk indicates</span> Required field</p>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
<Checkbox
              id="readPolicy"
              checked={agreements.readPolicy}
              onCheckedChange={(checked) => setAgreements({ ...agreements, readPolicy: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="readPolicy" className="text-white font-normal leading-relaxed">
              I have received, read, and understand the NECYPAA Anti-Harassment and Non-Discrimination Policy.{" "}
              <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="understandQuestions"
              checked={agreements.understandQuestions}
              onCheckedChange={(checked) => setAgreements({ ...agreements, understandQuestions: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="understandQuestions" className="text-white font-normal leading-relaxed">
              I understand that any questions I have regarding this policy can be directed to NECYPAA Advisory members.{" "}
              <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="acknowledgeBehavior"
              checked={agreements.acknowledgeBehavior}
              onCheckedChange={(checked) => setAgreements({ ...agreements, acknowledgeBehavior: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="acknowledgeBehavior" className="text-white font-normal leading-relaxed">
              I acknowledge that any behavior deemed unsafe or discriminatory by NECYPAA Advisory and/or NECYPAA Host
              may result in my removal from NECYPAA XXXVI and could lead to a ban from future NECYPAA events.{" "}
              <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="understandAdmission"
              checked={agreements.understandAdmission}
              onCheckedChange={(checked) => setAgreements({ ...agreements, understandAdmission: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="understandAdmission" className="text-white font-normal leading-relaxed">
              I understand that I will not be permitted to enter the NECYPAA convention if I do not check each box on
              this form. <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="understandReporting"
              checked={agreements.understandReporting}
              onCheckedChange={(checked) => setAgreements({ ...agreements, understandReporting: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="understandReporting" className="text-white font-normal leading-relaxed">
              I understand that I have the right to report any behavior deemed unsafe or discriminatory to NECYPAA
              Advisory and/or NECYPAA Host. <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="understandInvestigation"
              checked={agreements.understandInvestigation}
              onCheckedChange={(checked) =>
                setAgreements({ ...agreements, understandInvestigation: checked as boolean })
              }
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="understandInvestigation" className="text-white font-normal leading-relaxed">
              I understand that any reports I make will be fully investigated by NECYPAA Advisory.{" "}
              <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
<Checkbox
              id="signatureAgreement"
              checked={agreements.signatureAgreement}
              onCheckedChange={(checked) => setAgreements({ ...agreements, signatureAgreement: checked as boolean })}
              className="mt-1 border-gray-700"
              aria-required="true"
            />
            <Label htmlFor="signatureAgreement" className="text-white font-normal leading-relaxed">
              I understand that my checking each box serves as a signature and agreement to abide by the NECYPAA
              Anti-Harassment and Non-Discrimination policy. <span className="text-pink-400" aria-hidden="true">*</span><span className="sr-only">(required)</span>
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 text-white bg-transparent border-[var(--nec-border)]"
        >
          Back
        </Button>
        <Button
          onClick={() => onComplete(agreements)}
          disabled={!allAgreed}
          className="flex-1 text-white font-bold bg-[var(--nec-pink)] shadow-[0_2px_12px_rgba(192,38,211,0.25)]"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
