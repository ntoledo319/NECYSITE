export interface Intergroup {
  name: string
  url: string
  area?: string
}

export interface YPAACommittee {
  name: string
  url: string
}

export interface AlAnonInfo {
  url: string
  alateenUrl?: string
}

export interface StateResource {
  name: string
  abbreviation: string
  region: "new-england" | "expansion"
  flagSvg?: string
  intergroups: Intergroup[]
  areaServiceUrl?: string
  ypaaCommittee?: YPAACommittee
  alanon: AlAnonInfo
  meetingFinderUrl: string
  notes?: string
}

export const NECYPAA_STATES: StateResource[] = [
  {
    name: "Connecticut",
    abbreviation: "CT",
    region: "new-england",
    flagSvg: "/images/flags/ct.svg",
    intergroups: [
      {
        name: "Connecticut Area Intergroup",
        url: "https://ct-aa.org/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://www.ct-aa.org/",
    ypaaCommittee: {
      name: "Connecticut YPAA (CTYPAA)",
      url: "https://www.ctypaa.org/",
    },
    alanon: {
      url: "https://www.ct-al-anon.org/",
      alateenUrl: "https://www.ct-al-anon.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Connecticut",
    notes: "Host state for NECYPAA XXXVI.",
  },

  {
    name: "Maine",
    abbreviation: "ME",
    region: "new-england",
    flagSvg: "/images/flags/me.svg",
    intergroups: [
      {
        name: "Maine Area Intergroup",
        url: "https://www.maineaa.org/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://www.maineaa.org/",
    ypaaCommittee: {
      name: "Maine YPAA (MEYPAA)",
      url: "https://meypaa.org/",
    },
    alanon: {
      url: "https://www.maineafg.org/",
      alateenUrl: "https://www.maineafg.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Maine",
  },

  {
    name: "Massachusetts",
    abbreviation: "MA",
    region: "new-england",
    flagSvg: "/images/flags/ma.svg",
    intergroups: [
      {
        name: "Greater Boston AA Intergroup",
        url: "https://aaboston.org/",
        area: "Greater Boston",
      },
      {
        name: "Western Massachusetts Intergroup",
        url: "https://www.westernmassaa.org/",
        area: "Western MA",
      },
      {
        name: "South Shore Intergroup",
        url: "https://aasouthshore.org/",
        area: "South Shore",
      },
    ],
    areaServiceUrl: "https://aaemass.org/",
    ypaaCommittee: {
      name: "Massachusetts YPAA (MAYPAA)",
      url: "https://maypaa.org/",
    },
    alanon: {
      url: "https://www.ma-al-anon-alateen.org/",
      alateenUrl: "https://www.ma-al-anon-alateen.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Massachusetts",
  },

  {
    name: "New Hampshire",
    abbreviation: "NH",
    region: "new-england",
    flagSvg: "/images/flags/nh.svg",
    intergroups: [
      {
        name: "New Hampshire AA",
        url: "https://nhaa.net/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://nhaa.net/",
    alanon: {
      url: "https://nhal-anon.org/",
      alateenUrl: "https://nhal-anon.org/alateen/",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=New+Hampshire",
  },

  {
    name: "Rhode Island",
    abbreviation: "RI",
    region: "new-england",
    flagSvg: "/images/flags/ri.svg",
    intergroups: [
      {
        name: "Rhode Island Intergroup",
        url: "https://www.aainri.com/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://www.aainri.com/",
    ypaaCommittee: {
      name: "Rhode Island YPAA (RIYPAA)",
      url: "https://riypaa.org/",
    },
    alanon: {
      url: "https://www.riafg.org/",
      alateenUrl: "https://www.riafg.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Rhode+Island",
  },

  {
    name: "Vermont",
    abbreviation: "VT",
    region: "new-england",
    flagSvg: "/images/flags/vt.svg",
    intergroups: [
      {
        name: "Vermont AA",
        url: "https://aavt.org/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://aavt.org/",
    alanon: {
      url: "https://www.vermontalanonalateen.org/",
      alateenUrl: "https://www.vermontalanonalateen.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Vermont",
  },

  {
    name: "New York",
    abbreviation: "NY",
    region: "expansion",
    flagSvg: "/images/flags/ny.svg",
    intergroups: [
      {
        name: "New York Intergroup (Manhattan)",
        url: "https://www.nyintergroup.org/",
        area: "New York City",
      },
      {
        name: "Nassau Intergroup",
        url: "https://www.nassauny-aa.org/",
        area: "Long Island",
      },
      {
        name: "Hudson Mohawk Berkshire Intergroup",
        url: "https://aahmbny.org/",
        area: "Capital Region",
      },
    ],
    areaServiceUrl: "https://www.nyintergroup.org/",
    ypaaCommittee: {
      name: "New York YPAA (NYCYPAA)",
      url: "https://nycypaa.org/",
    },
    alanon: {
      url: "https://www.nyal-anon.org/",
      alateenUrl: "https://www.nyal-anon.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=New+York",
  },

  {
    name: "New Jersey",
    abbreviation: "NJ",
    region: "expansion",
    flagSvg: "/images/flags/nj.svg",
    intergroups: [
      {
        name: "Northern New Jersey Intergroup",
        url: "https://www.nnjaa.org/",
        area: "Northern NJ",
      },
      {
        name: "Central NJ Intergroup",
        url: "https://www.cnjintergroup.org/",
        area: "Central NJ",
      },
      {
        name: "South Jersey Intergroup",
        url: "https://www.aasj.org/",
        area: "Southern NJ",
      },
    ],
    areaServiceUrl: "https://www.nnjaa.org/",
    ypaaCommittee: {
      name: "New Jersey YPAA (NJYPAA)",
      url: "https://njypaa.org/",
    },
    alanon: {
      url: "https://www.nj-al-anon.org/",
      alateenUrl: "https://www.nj-al-anon.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=New+Jersey",
  },

  {
    name: "Pennsylvania",
    abbreviation: "PA",
    region: "expansion",
    flagSvg: "/images/flags/pa.svg",
    intergroups: [
      {
        name: "Philadelphia Intergroup",
        url: "https://www.aasepia.org/",
        area: "Southeastern PA",
      },
      {
        name: "Pittsburgh Central Office",
        url: "https://www.aapittsburgh.org/",
        area: "Western PA",
      },
    ],
    areaServiceUrl: "https://www.aasepia.org/",
    ypaaCommittee: {
      name: "Pennsylvania YPAA (PAYPAA)",
      url: "https://paypaa.org/",
    },
    alanon: {
      url: "https://www.pa-al-anon.org/",
      alateenUrl: "https://www.pa-al-anon.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Pennsylvania",
  },

  {
    name: "Maryland",
    abbreviation: "MD",
    region: "expansion",
    flagSvg: "/images/flags/md.svg",
    intergroups: [
      {
        name: "Baltimore Intergroup",
        url: "https://www.baltimoreaa.org/",
        area: "Baltimore Metro",
      },
      {
        name: "Maryland General Service",
        url: "https://www.marylandaa.org/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://www.marylandaa.org/",
    ypaaCommittee: {
      name: "Maryland YPAA (MDYPAA)",
      url: "https://mdypaa.org/",
    },
    alanon: {
      url: "https://www.marylandafalanon.org/",
      alateenUrl: "https://www.marylandafalanon.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Maryland",
  },

  {
    name: "Delaware",
    abbreviation: "DE",
    region: "expansion",
    flagSvg: "/images/flags/de.svg",
    intergroups: [
      {
        name: "Delaware Intergroup",
        url: "https://www.delaa.org/",
        area: "Statewide",
      },
    ],
    areaServiceUrl: "https://www.delaa.org/",
    alanon: {
      url: "https://www.al-anonde.org/",
      alateenUrl: "https://www.al-anonde.org/alateen",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Delaware",
  },

  {
    name: "Washington, D.C.",
    abbreviation: "DC",
    region: "expansion",
    flagSvg: "/images/flags/dc.svg",
    intergroups: [
      {
        name: "Washington Area Intergroup (WAIA)",
        url: "https://www.aa-dc.org/",
        area: "DC Metro",
      },
    ],
    areaServiceUrl: "https://www.aa-dc.org/",
    ypaaCommittee: {
      name: "DC YPAA (DCYPAA)",
      url: "https://dcypaa.org/",
    },
    alanon: {
      url: "https://www.dcafg.org/",
    },
    meetingFinderUrl: "https://www.aa.org/find-aa?query=Washington+DC",
    notes: "District of Columbia — not a state, but a full NECYPAA member.",
  },
]

