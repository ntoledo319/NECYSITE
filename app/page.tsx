"use client"

import Image from "next/image"
import Link from "next/link"
import { MobileMenu } from "@/components/mobile-menu"
import { MeetingCard } from "@/components/meeting-card"
import { ExpandableMeetingRow } from "@/components/expandable-meeting-row"
import { useState, useEffect } from "react"
import FlyerModal from "@/components/flyer-modal"
import { ZoomIn } from "lucide-react"
import FlyerWithModal from "@/components/flyer-with-modal" // Declare the variable before using it

/**
 * Returns the next upcoming business meeting date.
 * Business meetings are held on the 1st and 3rd Sundays of every month at 2:00 PM ET.
 * If the current time is before 2 PM on a meeting Sunday, that day is returned.
 * Otherwise, the next meeting Sunday is returned.
 */
function getNextBusinessMeetingDate(): Date {
  const now = new Date()

  // Helper: get the nth Sunday (1-indexed) of a given month/year
  function getNthSunday(year: number, month: number, n: number): Date {
    // Start at the 1st of the month
    const first = new Date(year, month, 1)
    // Day of week for the 1st (0=Sun, 1=Mon, ...)
    const dayOfWeek = first.getDay()
    // Days until the first Sunday
    const daysUntilSunday = (7 - dayOfWeek) % 7
    // The first Sunday's date
    const firstSunday = 1 + daysUntilSunday
    // The nth Sunday's date
    return new Date(year, month, firstSunday + (n - 1) * 7)
  }

  // Check current month and the next 2 months to find the next meeting Sunday
  for (let offset = 0; offset < 3; offset++) {
    const year = new Date(now.getFullYear(), now.getMonth() + offset, 1).getFullYear()
    const month = new Date(now.getFullYear(), now.getMonth() + offset, 1).getMonth()

    for (const nth of [1, 3]) {
      const meetingDate = getNthSunday(year, month, nth)
      // Meeting is at 2:00 PM — treat the meeting as "upcoming" until 2 PM passes
      const meetingTime = new Date(meetingDate)
      meetingTime.setHours(14, 0, 0, 0)

      if (meetingTime > now) {
        return meetingDate
      }
    }
  }

  // Fallback (should never reach here)
  return new Date()
}

/** Format a Date as e.g. "Sunday, March 2nd" */
function formatMeetingDate(date: Date): string {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const day = date.getDate()
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th"
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${day}${suffix}`
}

// Meeting data organized by day with updated information
const meetingsByDay = {
  Sunday: [
    {
      name: "A Vision For Us",
      time: "7:30 PM",
      location: "Sacred Heart Church School",
      city: "Danbury",
      address: "12 Cottage St",
      types: "Discussion, Online Meeting, Open, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/do-it-sober-young-peoples-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person and Online",
    },
    {
      name: "UConn Young Peoples",
      time: "7:30 PM",
      location: "Storrs Congregational Church",
      city: "Storrs",
      address: "2 N Eagleville Rd",
      types: "Discussion, Open, Speaker, Wheelchair Access, Young People",
      url: "https://ct-aa.org/meetings/sunday-nite-live-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
  Monday: [
    {
      name: "Y.A.N.A. Young Peoples Group",
      time: "6:00 PM",
      location: "Wolcott Activ & Learning Center",
      city: "Wolcott",
      address: "48 Todd Rd",
      types: "Discussion, Open, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/y-a-n-a-young-peoples/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Coventry Young Peoples Group",
      time: "7:00 PM",
      location: "Second Congregational Church",
      city: "Coventry",
      address: "1746 Boston Turnpike",
      types: "Discussion, Open, Young People",
      url: "https://ct-aa.org/meetings/coventry-young-peoples-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Beyond Your Wildest Dreams Group",
      time: "8:00 PM",
      location: "First Baptist Church",
      city: "New Haven",
      address: "205 Edwards St",
      types: "Closed, Step Meeting, Young People",
      url: "https://ct-aa.org/meetings/beyond-your-wildest-dreams-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
  Tuesday: [
    {
      name: "Forever Young Group",
      time: "7:00 PM",
      location: "Bethany Lutheran Church",
      city: "West Hartford",
      address: "1655 Boulevard",
      types: "Discussion, Open, Wheelchair Access, Young People",
      url: "https://ct-aa.org/meetings/forever-young-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Choices Young Peoples Group",
      time: "7:00 PM",
      location: "Walnut Hill Community Church",
      city: "Waterbury",
      address: "274 Bunker Hill Ave",
      types: "Discussion, Open, Young People",
      url: "https://ct-aa.org/meetings/choices-young-peoples-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Canton Young People's-Open Topic Discussion",
      time: "7:30 PM",
      location: "First Congregational Church",
      city: "Canton",
      address: "184 Cherry Brook Rd",
      types: "Discussion, Open, Young People",
      url: "https://ct-aa.org/meetings/canton-young-peoples-open-topic-discussion/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Your Not Alone",
      time: "7:30 PM",
      location: "ZOOM ID: 463 705 209, Password: 123795",
      city: "Online",
      address: "",
      types: "Discussion, Online Meeting, Open, Young People",
      url: "https://ct-aa.org/meetings/tuesday-night-young-peoples-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "Online",
    },
    {
      name: "The Steps to Serenity",
      time: "7:30 PM",
      location: "Grace Lutheran Church",
      city: "Middletown",
      address: "1055 Randolph Rd",
      types: "Closed, Discussion, Step Meeting, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/tuesday-step-meeting-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Canaan Young Peoples Group",
      time: "8:00 PM",
      location: "Canaan United Methodist Church",
      city: "Canaan",
      address: "4 Church St",
      types: "Open, Speaker, Young People",
      url: "https://ct-aa.org/meetings/canaan-young-peoples-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
  Wednesday: [
    {
      name: "Young People's Greenwich",
      time: "7:00 PM",
      location: "YWCA",
      city: "Greenwich",
      address: "259 E Putnam Ave",
      types: "Wheelchair Access, Young People",
      url: "https://ct-aa.org/meetings/young-peoples-greenwich/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
  Thursday: [
    {
      name: "Deep River Young People's Meeting",
      time: "7:00 PM",
      location: "First Congregational Church",
      city: "Deep River",
      address: "1 Church St",
      types: "Discussion, Newcomer, Open, Young People",
      url: "https://ct-aa.org/meetings/deep-river-beginners-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Young and the Restless Group",
      time: "7:30 PM",
      location: "Long Hill United Methodist Church",
      city: "Trumbull",
      address: "6358 Main St",
      types: "Discussion, Online Meeting, Open, Wheelchair Access, Young People",
      url: "https://ct-aa.org/meetings/young-restless/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person and Online",
    },
  ],
  Friday: [
    {
      name: "Guilford Young People's",
      time: "7:00 PM",
      location: "Guilford Athletic Center",
      city: "Guilford",
      address: "391 Soundview Rd",
      types: "Discussion, Open, Young People",
      url: "https://ct-aa.org/meetings/guilford-young-peoples/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Enfield Young People's Group",
      time: "7:00 PM",
      location: "United Methodist Church",
      city: "Enfield",
      address: "330 Hazard Ave",
      types: "Discussion, Open, Speaker, Young People",
      url: "https://ct-aa.org/meetings/enfield-young-peoples/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Young Grenadiers",
      time: "7:30 PM",
      location: "St James Episcopal Church",
      city: "Farmington",
      address: "3 Mountain Rd",
      types: "Open, Step Meeting, Young People",
      url: "https://ct-aa.org/meetings/steppin-free-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "The Joy of Living Group",
      time: "8:00 PM",
      location: "Bible Church of Waterbury",
      city: "Waterbury",
      address: "240 Dwight St",
      types: "Discussion, Open, Speaker, Step Meeting, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/the-joy-of-living/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
  Saturday: [
    {
      name: "Saturday Morning BYOC Group",
      time: "9:30 AM",
      location: "Colchester Federated Church",
      city: "Colchester",
      address: "60 Main St",
      types: "Discussion, Online Meeting, Open, Step Meeting, Young People",
      url: "https://ct-aa.org/meetings/saturday-morning-byoc-group/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person and Online",
    },
    {
      name: "Never Too Young",
      time: "5:30 PM",
      location: "Greens Farms Church",
      city: "Westport",
      address: "71 Hillandale Rd",
      types: "Discussion, Newcomer, Open, Young People",
      url: "https://ct-aa.org/meetings/never-too-young-2/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Young and The Restless SHU",
      time: "7:00 PM",
      location: "SHU Campus",
      city: "Fairfield",
      address: "5401 Park Ave",
      types:
        "Discussion, English, Literature, Open, Speaker, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/young-the-restless-shu/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
    {
      name: "Never Too Young Group",
      time: "7:00 PM",
      location: "South Congregational Church",
      city: "South Glastonbury",
      address: "949 Main St",
      types: "Discussion, Open, Wheelchair Access, Wheelchair-Accessible Bathroom, Young People",
      url: "https://ct-aa.org/meetings/never-too-young/?tsml-day=any&tsml-distance=100&tsml-mode=location&tsml-query=06106&tsml-type=Y",
      attendance: "In-person",
    },
  ],
}

// All meetings for the table view
const allMeetings = Object.entries(meetingsByDay).flatMap(([day, meetings]) =>
  meetings.map((meeting) => ({ day, ...meeting })),
)

export default function HomePage() {
  // State for modal
  const [enlargedFlyer, setEnlargedFlyer] = useState<{ src: string; alt: string } | null>(null)

  // Auto-calculate next business meeting date (1st and 3rd Sundays)
  const [nextMeetingDateStr, setNextMeetingDateStr] = useState<string>("")
  useEffect(() => {
    setNextMeetingDateStr(formatMeetingDate(getNextBusinessMeetingDate()))
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0f172a" }}>
      {/* FlyerModal component */}
      <FlyerModal
        src={enlargedFlyer?.src || ""}
        alt={enlargedFlyer?.alt || ""}
        isOpen={!!enlargedFlyer}
        onClose={() => setEnlargedFlyer(null)}
      />

      <header className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">NECYPAA CT HOST</h1>
          <nav className="hidden md:flex space-x-6">
            <Link href="#purpose" className="text-gray-300 hover:text-blue-400 font-medium uppercase">
              NECYPAA'S PURPOSE
            </Link>
            <Link href="#meetings" className="text-gray-300 hover:text-blue-400 font-medium uppercase">
              YP MEETINGS
            </Link>
            <Link
              href="https://necypaa.org/"
              className="text-gray-300 hover:text-blue-400 font-medium uppercase"
              target="_blank"
              rel="noopener noreferrer"
            >
              ADVISORY
            </Link>
            <Link
              href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1770049957031&key=GRP&app=resvlink"
              className="text-gray-300 hover:text-blue-400 font-medium uppercase"
              target="_blank"
              rel="noopener noreferrer"
            >
              BOOK HOTEL
            </Link>
            <Link
              href="/register"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium uppercase transition-colors"
            >
              REGISTER
            </Link>
          </nav>
          <MobileMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Convention Hero - Mimics flyer style */}
        <section className="mb-16">
          <div className="relative p-8 md:p-16 rounded-3xl shadow-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 25%, #1e3a5f 50%, #4a1942 75%, #0d1b2a 100%)" }}>
            {/* Cosmic background glow effects */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full blur-[100px] animate-pulse delay-150"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-300"></div>
            </div>

            {/* Subtle star-like dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[15%] left-[8%] w-1 h-1 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-[25%] right-[12%] w-1.5 h-1.5 bg-white rounded-full opacity-40"></div>
              <div className="absolute bottom-[20%] left-[30%] w-1 h-1 bg-white rounded-full opacity-50"></div>
              <div className="absolute top-[60%] right-[20%] w-1 h-1 bg-white rounded-full opacity-70"></div>
              <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 bg-white rounded-full opacity-30"></div>
              <div className="absolute bottom-[35%] right-[40%] w-1 h-1 bg-white rounded-full opacity-50"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left side - Convention info */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  {/* Title */}
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight drop-shadow-2xl" style={{ textShadow: "0 0 40px rgba(255,255,255,0.15)" }}>
                      NECYPAA XXXVI
                    </h2>
                    <p className="text-lg md:text-xl text-pink-200 mt-2 italic font-medium">
                      The Northeast Convention of Young People In Alcoholics Anonymous
                    </p>
                  </div>

                  {/* New Year's Eve callout */}
                  <div className="inline-block">
                    <p className="text-3xl md:text-4xl font-black italic text-yellow-300 drop-shadow-lg" style={{ textShadow: "0 0 20px rgba(253,224,71,0.4)" }}>
                      {"New Year's Eve!!!"}
                    </p>
                  </div>

                  {/* Convention details */}
                  <div className="space-y-3 text-lg md:text-xl text-green-300 font-semibold">
                    <p>4 Day YPAA Convention</p>
                    <p>@ the Hartford Marriott Downtown</p>
                    <p className="text-white font-bold">Thursday, December 31, 2026</p>
                    <p className="text-white font-bold">- Sunday, January 3, 2027</p>
                  </div>

                  {/* Book rooms callout */}
                  <p className="text-red-400 font-bold text-lg italic" style={{ textShadow: "0 0 10px rgba(248,113,113,0.3)" }}>
                    *Book Rooms Now - Pay Later
                  </p>

                  {/* Registration + Hotel buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-black text-lg py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-pink-600/30 uppercase tracking-wide"
                    >
                      Pre-Register - $40
                    </Link>
                    <a
                      href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1770049957031&key=GRP&app=resvlink"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 uppercase tracking-wide"
                    >
                      Book Hotel
                    </a>
                  </div>
                </div>

                {/* Right side - Flyer image */}
                <div className="lg:w-96 flex-shrink-0">
                  <FlyerWithModal
                    src="/images/necypaa-xxxvi-flyer.png"
                    alt="NECYPAA XXXVI - New Year's Eve 2026 - 4 Day YPAA Convention at the Hartford Marriott Downtown"
                    title="NECYPAA XXXVI"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Business Meeting */}
        <section className="mb-16">
          <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Next Business Meeting
          </h2>

          <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-white">NECYPAA 36 Business Meeting</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-bold">{nextMeetingDateStr || "Loading..."}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-bold">2:00 PM</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">
                  Join us on Zoom for the next NECYPAA 36 business meeting. All are welcome!
                </p>
                <a
                  href="https://us06web.zoom.us/j/5692382899?omn=86491828124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 10.5l-4-2.5v5l4-2.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8z" />
                  </svg>
                  Join on Zoom
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section id="purpose" className="mt-16 py-8">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            NECYPAA'S PURPOSE
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            The North East Convention of Young People in Alcoholics Anonymous (NECYPAA) was established in 1989 by an
            Advisory Council to organize an annual conference for young people in recovery within Alcoholics Anonymous
            (AA). NECYPAA plays a crucial role in spreading AA's message throughout the North East, providing a platform
            for young AA members to come together, share their experiences, and support each other.
          </p>
          <p className="text-lg text-gray-300">
            While the focus is on young people, individuals of all ages are welcome to attend NECYPAA conferences. It's
            important for non-alcoholics attending to respect the anonymity of all AA members present.
          </p>
        </section>

        {/* Past Events Section */}
        <section id="events" className="mt-16 py-8">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Past Events
          </h2>

          <div className="space-y-6">
            {/* Zombie Prom */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">Zombie Prom</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Friday, February 13th, 2026
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> Enfield United Church of Christ, 1295 Enfield Street, Enfield, CT 06082
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Schedule:</span>
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>{"Hype: 6:30 - 7:00 PM"}</li>
                    <li>{"Meeting: 7:00 - 8:00 PM"}</li>
                    <li>{"Dance: 8:00 PM - Dawn"}</li>
                  </ul>
                  <p>
                    <span className="font-semibold text-blue-400">Hosted by:</span> NECYPAA 36 and The Bay State Bid for NECYPAA
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Suggested Contribution:</span> $15
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    A spooky night of dancing, fellowship, and fun! Attendees dressed in their best zombie prom attire and celebrated recovery with friends from across the North East.
                  </p>
                </div>
                <div className="w-full md:w-72 flex-shrink-0">
                  <FlyerWithModal
                    src="/images/zombie-prom-flyer.jpeg"
                    alt="Zombie Prom - Friday February 13th"
                    title="Zombie Prom"
                  />
                </div>
              </div>
            </div>

            {/* NYE Meeting 2026 */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info on the left */}
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">NYE Meeting 2026</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Wednesday, December 31, 2025
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> Bristol Recovery Club, 67 West St,
                    Bristol CT
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Schedule:</span>
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Meeting: 8:30 PM</li>
                    <li>Food/Dance/Party: 9:30 PM</li>
                  </ul>
                  <p>
                    <span className="font-semibold text-blue-400">Entertainment:</span> Balldrop Televised Live
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Cohost:</span> The Happy Hour Group & CT Bid for
                    NECYPAA
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Tickets:</span> $15 in advance, $20 at the door
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">RSVP:</span> Meadow 860-707-0268, Danielle
                    860-987-3956
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    A fantastic night of recovery, fellowship, and celebration to ring in 2026!
                  </p>
                </div>

                {/* Flyer on the right with frame */}
                <div className="w-full md:w-72 flex-shrink-0">
                  <div
                    className="relative bg-gray-900 p-3 rounded-lg border-2 border-gray-700 group-hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onClick={() =>
                      setEnlargedFlyer({
                        src: "/images/50a7821a-d39f-4197-ac4e-efc919034db9.jpg",
                        alt: "NYE Meeting 2026 Flyer",
                      })
                    }
                  >
                    <Image
                      src="/images/50a7821a-d39f-4197-ac4e-efc919034db9.jpg"
                      alt="NYE Meeting 2026 Flyer"
                      width={400}
                      height={533}
                      className="rounded w-full h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trivia Night */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info on the left */}
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">Trivia Night</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Saturday, December 13, 2025
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Time:</span> Starts at 6:30 PM
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> Milford VFW, 422 Naugatuck Ave,
                    Milford CT
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Theme:</span> Knowledge Wins; Sobriety Shines
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Suggested Contribution:</span> $15
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Presented by:</span> CT Bid for NECYPAA
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    A fun evening of trivia, fellowship, and friendly competition to support our NECYPAA bid!
                  </p>
                </div>

                {/* Flyer on the right with frame */}
                <div className="w-full md:w-72 flex-shrink-0">
                  <div
                    className="relative bg-gray-900 p-3 rounded-lg border-2 border-gray-700 group-hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onClick={() =>
                      setEnlargedFlyer({
                        src: "/images/a073eef2-301c-4220-ab01-45ca5a3e5ee6.jpg",
                        alt: "Trivia Night Flyer",
                      })
                    }
                  >
                    <Image
                      src="/images/a073eef2-301c-4220-ab01-45ca5a3e5ee6.jpg"
                      alt="Trivia Night Flyer"
                      width={400}
                      height={711}
                      className="rounded w-full h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RAVE HALLOWEEN 2.0 Event */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info on the left */}
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">RAVE HALLOWEEN 2.0</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Thursday, November 7, 2025
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> Bristol Recovery Club, 67 West St,
                    Bristol, CT 06010
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Schedule:</span>
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>7:30 PM - Meeting</li>
                    <li>8:30 PM - Rave</li>
                  </ul>
                  <p>
                    <span className="font-semibold text-blue-400">Attire:</span> Costumes, PJs, or whatever!
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Activities:</span> Dance, Games, Arts and Crafts
                  </p>
                  <p>Pizza will be provided</p>
                  <p>
                    <span className="font-semibold text-blue-400">Suggested contribution:</span> $10
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    One night of fright was never enough! An evening of dancing, games, arts and crafts, and fellowship
                    to support our NECYPAA bid.
                  </p>
                </div>

                {/* Flyer on the right with frame */}
                <div className="w-full md:w-72 flex-shrink-0">
                  <div
                    className="relative bg-gray-900 p-3 rounded-lg border-2 border-gray-700 group-hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onClick={() =>
                      setEnlargedFlyer({
                        src: "/images/rave-halloween.jpeg",
                        alt: "RAVE HALLOWEEN 2.0 Event Flyer",
                      })
                    }
                  >
                    <Image
                      src="/images/rave-halloween.jpeg"
                      alt="RAVE HALLOWEEN 2.0 Event Flyer"
                      width={400}
                      height={533}
                      className="rounded w-full h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cardboard Masquerade Event */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info on the left */}
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">Cardboard Masquerade</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Friday, May 30, 2025 at 7:30 PM
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> 3 Mountain Rd, Farmington, CT 06032
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Suggested contribution:</span> $10
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    A night of mask-making, board games, pizza, and fellowship to support our NECYPAA bid! This event
                    featured a masquerade ball, DIY mask-making station, board games, and plenty of pizza and snacks.
                  </p>
                </div>

                {/* Flyer on the right with frame */}
                <div className="w-full md:w-72 flex-shrink-0">
                  <div
                    className="relative bg-gray-900 p-3 rounded-lg border-2 border-gray-700 group-hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onClick={() =>
                      setEnlargedFlyer({
                        src: "/flyer.png",
                        alt: "Cardboard Masquerade Event Flyer",
                      })
                    }
                  >
                    <Image
                      src="/flyer.png"
                      alt="Cardboard Masquerade Event Flyer"
                      width={400}
                      height={533}
                      className="rounded w-full h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Night, Pajama Party & Half-Assed Rave Event */}
            <div className="group bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info on the left */}
                <div className="flex-1 space-y-3 text-gray-300">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">Game Night, Pajama Party & Half-Assed Rave</h3>
                  <p>
                    <span className="font-semibold text-blue-400">Date:</span> Friday, April 11, 2025
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Location:</span> Pathfinders Club, 102 Norman St,
                    Manchester, CT
                  </p>
                  <p>
                    <span className="font-semibold text-blue-400">Schedule:</span>
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>7:30 PM - Meeting: "Happy, Joyous, and Free" Panel</li>
                    <li>8:30 PM - Games and Fellowship</li>
                  </ul>
                  <p>
                    <span className="font-semibold text-blue-400">Suggested donation:</span> $10
                  </p>
                  <p className="mt-4 text-gray-400 italic">
                    A fun night of games, fellowship, and a half-assed rave to support our NECYPAA bid! Featured a panel
                    discussion, board games, and plenty of snacks.
                  </p>
                </div>

                {/* Flyer on the right with frame */}
                <div className="w-full md:w-72 flex-shrink-0">
                  <div
                    className="relative bg-gray-900 p-3 rounded-lg border-2 border-gray-700 group-hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                    onClick={() =>
                      setEnlargedFlyer({
                        src: "/images/game-night.jpeg",
                        alt: "Game Night, Pajama Party & Half-Assed Rave Event Flyer",
                      })
                    }
                  >
                    <Image
                      src="/images/game-night.jpeg"
                      alt="Game Night, Pajama Party & Half-Assed Rave Event Flyer"
                      width={400}
                      height={533}
                      className="rounded w-full h-auto object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meetings Section */}
        <section id="meetings" className="mt-16 py-8">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Young People's Meetings in Connecticut
          </h2>
          <p className="text-gray-300 mb-6">
            Click on any meeting name to view more details on the CT-AA website. Click the arrow to expand and see
            address and meeting types.
          </p>

          {/* Desktop Table - Hidden on Mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="p-3 text-left text-gray-300 font-semibold">Day</th>
                  <th className="p-3 text-left text-gray-300 font-semibold">Time</th>
                  <th className="p-3 text-left text-gray-300 font-semibold">Meeting</th>
                  <th className="p-3 text-left text-gray-300 font-semibold">Location</th>
                  <th className="p-3 text-left text-gray-300 font-semibold">City</th>
                  <th className="p-3 text-left text-gray-300 font-semibold">Attendance</th>
                  <th className="p-3 text-center text-gray-300 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {allMeetings.map((meeting, index) => (
                  <ExpandableMeetingRow key={index} meeting={meeting} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards - Shown only on Mobile */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {Object.entries(meetingsByDay).map(([day, meetings]) => (
              <MeetingCard key={day} day={day} meetings={meetings} />
            ))}
          </div>

          {/* Add Meeting Information */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Add Your Meeting</h3>
            <p className="text-gray-300 mb-4">
              Know of a young people's meeting that's not on our list? Email us with the details and we'll add it!
            </p>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400 mr-2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:info@necypaa.org" className="text-blue-400 hover:underline">
                info@necypaa.org
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">NECYPAA CT HOST</h2>
            <p className="text-gray-300 mb-4">New England Conference of Young People in AA</p>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400 mr-2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:info@necypaa.org" className="text-blue-400 hover:underline">
                info@necypaa.org
              </a>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}
