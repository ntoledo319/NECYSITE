export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  category: "update" | "story" | "recap" | "announcement"
  publishedAt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "YPAA Saved My Life",
    slug: "ypaa-saved-my-life",
    excerpt:
      "YPAA has saved my life, from walking into my first young people\u2019s meeting 24 hours sober so many years ago to a life full of service today.",
    body: `Being roped into this committee I found my sobriety set into overdrive. YPAA has saved my life, from walking into my first young people\u2019s meeting 24 hours sober so many years ago to a life full of service today. YPAA showed me my own alcoholism I was too sick and delusional to see. YPAA showed me true Big Book sobriety. It showed me how to live life in all its joys and tragedies. YPAA showed me a true enthusiasm and passion for recovery I\u2019ve yet to see in any other sector of AA. This committee has revived that for me, and I felt it walking into my home group a few days after winning host at NECYPAA 35, walking in excited and triumphant with another fellow AA who was there as well. Together we\u2019ve seen a fellowship grow around us again in a new and explosive way. My life is full and there\u2019s no end to the service we get to do. I\u2019m here for all of it, as YPAA has continued to save my life one day at a time, as it has for so many years now.`,
    category: "story",
    publishedAt: "2026-03-01",
  },
  {
    id: "2",
    title: "A Life Beyond My Wildest Dreams",
    slug: "a-life-beyond-my-wildest-dreams",
    excerpt: "The amount of love and joy overflowing through all the hearts of this committee is top tier.",
    body: `Being a part of this committee, from when we were a bid, to now being host\u2026 man\u2026 a life beyond my wildest dreams. The amount of love and joy overflowing through all the hearts of this committee is top tier. I\u2019m going to do my best to continue to spread that love to every corner I can because of the way they love me.\n\nThank you NECYPAA XXXVI HOST!`,
    category: "story",
    publishedAt: "2026-03-05",
  },
  {
    id: "3",
    title: "Placed Where I\u2019m Needed",
    slug: "placed-where-im-needed",
    excerpt: "At a recent young people\u2019s recovery event, I had a Higher Power moment that I will not forget.",
    body: `At a recent young people\u2019s recovery event, I had a Higher Power moment that I will not forget.

It was the end of a long weekend filled with meetings, fellowship, and constant reminders of the past. I had less than six hours of sleep total. I was physically exhausted and emotionally drained, and it felt like everything was trying to pull me down as far as possible. I was overwhelmed and just trying to hold myself together.

Right at the end, someone came up to me who was clearly distraught. They told me they had walked away from two kids they knew for seven years through a past relationship. They were heartbroken and overwhelmed. They could not reach their sponsor or any of their usual contacts and did not know what to do. I was able to sit down with them and talk.

I told them they needed to put everything down on pen and paper so they could sort through the emotions and see things more clearly. Then they asked me what I would do.

What came out of me did not feel planned. It felt given.

I told them those two girls have only known men walking away from their lives without explanation. The healthiest thing they could do for those girls would be to explain why they walked away, to make sure the girls knew it was not their fault, and to remind them of the good memories they all shared that would never be forgotten.

As I said it, the moment floored me.

All weekend I had been spiritually and emotionally worn down. Yet in that exact moment, I felt clarity and purpose. It reminded me that the difficulty I was feeling was only for today, not forever. Being able to help someone else pulled me out of my own thoughts and reminded me why service matters so much.

That person was placed in my path for a reason.

Experiences like this are why it is so important for me to attend these events as much as possible. You truly have no idea where you will be placed in this life or how you might be used to help someone else. When I stop focusing on myself and try to be helpful to another person, I am practicing the kind of service our program teaches in Step Twelve, and I am supporting the spirit of unity that keeps our fellowship strong.

If my intentions are pure and I stay willing, I believe my Higher Power will continue to place me exactly where I am meant to be so I can be useful.

And for that, I am grateful.`,
    category: "story",
    publishedAt: "2026-03-10",
  },
  {
    id: "4",
    title: "A Complaint I Can\u2019t Seem to Make",
    slug: "a-complaint-i-cant-seem-to-make",
    excerpt:
      "I hope, over the coming months, to fill you in on what these people have done to me \u2014 and what they\u2019ll continue to do. I really want to complain, but my life is so much better.",
    body: `It\u2019s been a sea of spiritual experiences since I got dragged into that bid that turned into this host, and my life changed for the better (Column 1 has a nice seat reserved for our leadership on that one).

I hope, over the coming months, to fill you in on what these people have done to me \u2014 and what they\u2019ll continue to do. I really want to complain, but my life is so much better.

Like, let\u2019s look at a recent event. I went to this NECYPAA thing, had a great time, bonded with fellows, and was feeling a bit of a service buzz. (I am being told this is called \u201Cinsomnia-induced madness\u201D \u2014 more on that to come!)

Anyways, after the event some of us folks didn\u2019t want to stop the vibes, so we went to hang out. Turns out one of our number wasn\u2019t feeling great. So I got an opportunity to actually be a friend \u2014 I was able to, like, be \u201Cnormal\u201D and \u201Csupportive\u201D and found myself \u201Coverwhelmed\u201D with \u201Clove,\u201D \u201Ccompassion,\u201D and the \u201Cpresence of God.\u201D

So anyways, life goes on. I say my farewells, and the next day I go about my remaining tasks. Some of that involved just stuff I\u2019ve always done \u2014 neither here nor there. Stuff that vibes clean on an inventory: no harms, just life as life has always been. Thing is \u2014 it wasn\u2019t doing anything for me. I had to wonder, \u201CWhy am I broken, and how can I blame it on NECYPAA 36 host?\u201D

Well, well, well \u2014 let me tell you. After a little 10th and 11th Step, I figured it out right proper. You see, I had found in my love for my fellows \u2014 dare I say *friends*, for whom I have acquired such a profound spiritual connection to and through \u2014 that the bottom-barrel stuff I used to pass off as quality content in my life wouldn\u2019t cut it anymore.

It is now an ungodly hour, and I am crying at a highway roadside service plaza. I am no stranger to crying in the club, but for some reason this was worse. You see, this meant I was wrong about fundamental aspects of who I was and who I can be. I really am capable of change and growth beyond my comprehension. I really am capable of putting aside selfish thoughts and motivations in the interest of my fellows. In fact, I messed up so well that after what should have been a perfectly good day of nonsense, I was viscerally unsatisfied \u2014 in contrast to having been a being of love and compassion that I really still don\u2019t understand, just a day before.

This all should have been mundane. Not everything needs a deep and philosophical meaning. But now I am so overwhelmed with gratitude and connection to others and my Higher Power that I cannot stop living in the blessings of a universe made so fundamentally of love that it defies understanding. And I didn\u2019t even do that much to help that friend! What the fuck! Why am I crying \u2014 this isn\u2019t the club.

No, dear friends, this is no club. This is NECYPAA 36 host \u2014 where you will come to, I don\u2019t know, stroke your ego a bit, and leave a better person by such a magnitude that you\u2019re unrecognizable.

I\u2019ve got loads more of these. I intend to mine my last few months of inventories to provide y\u2019all with some more content.`,
    category: "story",
    publishedAt: "2026-03-15",
  },
]
