export const INITIAL_ASSETS = [
  {
    itemId: "AST-000001",
    item_id: "AST-000001",
    item_code: "AST-000001",
    itemName: "Projector #01",
    item_name: "Projector #01",
    type_id: "TYP-001",
    type_code: "PRJ",
    itemType: "Projector",
    loc_id: "LOC-A203",
    description: "Ceiling-mounted Epson EB-X06 projector with HDMI/VGA inputs.",
    building: "Main Academic Block",
    floor: "2",
    room: "A-203",
    latitude: 18.520430,
    longitude: 73.856744,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000001",
    createdAt: "2026-09-10T09:00:00.000Z",
    updatedAt: "2026-09-15T10:00:00.000Z",
    locationUpdatedAt: "2026-09-15T10:00:00.000Z"
  },
  {
    itemId: "AST-000002",
    item_id: "AST-000002",
    item_code: "AST-000002",
    itemName: "AC Unit #02",
    item_name: "AC Unit #02",
    type_id: "TYP-002",
    type_code: "AC",
    itemType: "Air Conditioner",
    loc_id: "LOC-A203",
    description: "Voltas 2-Ton Split Inverter Air Conditioner.",
    building: "Main Academic Block",
    floor: "2",
    room: "A-203",
    latitude: 18.520480,
    longitude: 73.856790,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000002",
    createdAt: "2026-09-10T09:15:00.000Z",
    updatedAt: "2026-09-10T09:15:00.000Z",
    locationUpdatedAt: "2026-09-10T09:15:00.000Z"
  },
  {
    itemId: "AST-000003",
    item_id: "AST-000003",
    item_code: "AST-000003",
    itemName: "Ceiling Fan #04",
    item_name: "Ceiling Fan #04",
    type_id: "TYP-003",
    type_code: "FAN",
    itemType: "Ceiling Fan",
    loc_id: "LOC-B301",
    description: "Havells 1200mm high-speed ceiling fan near entrance window.",
    building: "Science & CS Block",
    floor: "3",
    room: "B-301",
    latitude: 18.521150,
    longitude: 73.857320,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000003",
    createdAt: "2026-09-11T11:00:00.000Z",
    updatedAt: "2026-09-11T11:00:00.000Z",
    locationUpdatedAt: "2026-09-11T11:00:00.000Z"
  },
  {
    itemId: "AST-000004",
    item_id: "AST-000004",
    item_code: "AST-000004",
    itemName: "Interactive Smart Board #01",
    item_name: "Interactive Smart Board #01",
    type_id: "TYP-004",
    type_code: "SMB",
    itemType: "Smart Board",
    loc_id: "LOC-B301",
    description: "75-inch ViewSonic 4K touch display for digital lectures.",
    building: "Science & CS Block",
    floor: "3",
    room: "B-301",
    latitude: 18.521180,
    longitude: 73.857360,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000004",
    createdAt: "2026-09-12T14:30:00.000Z",
    updatedAt: "2026-09-12T14:30:00.000Z",
    locationUpdatedAt: "2026-09-12T14:30:00.000Z"
  },
  {
    itemId: "AST-000005",
    item_id: "AST-000005",
    item_code: "AST-000005",
    itemName: "RO Water Cooler #01",
    item_name: "RO Water Cooler #01",
    type_id: "TYP-005",
    type_code: "WTR",
    itemType: "Water Cooler",
    loc_id: "LOC-LIB1",
    description: "Blue Star 80L stainless steel water purifier and chiller.",
    building: "Library & Central Facility",
    floor: "1",
    room: "Corridor East",
    latitude: 18.519920,
    longitude: 73.856100,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000005",
    createdAt: "2026-09-12T16:00:00.000Z",
    updatedAt: "2026-09-12T16:00:00.000Z",
    locationUpdatedAt: "2026-09-12T16:00:00.000Z"
  },
  {
    itemId: "AST-000006",
    item_id: "AST-000006",
    item_code: "AST-000006",
    itemName: "Lab Workstation #12",
    item_name: "Lab Workstation #12",
    type_id: "TYP-006",
    type_code: "PC",
    itemType: "Lab Computer",
    loc_id: "LOC-MCA1",
    description: "Dell OptiPlex 7090 Tower with Dual Monitor setup in MCA Lab 1.",
    building: "Science & CS Block",
    floor: "1",
    room: "MCA Computer Lab 1",
    latitude: 18.521010,
    longitude: 73.857150,
    status: "ACTIVE",
    qrUrl: "https://campusfix1.vercel.app/report/AST-000006",
    createdAt: "2026-09-13T10:00:00.000Z",
    updatedAt: "2026-09-13T10:00:00.000Z",
    locationUpdatedAt: "2026-09-13T10:00:00.000Z"
  }
];

export const INITIAL_TICKETS = [
  {
    ticketId: "TKT-2026-000001",
    itemId: "AST-000001",
    ticketType: "Not Working",
    description: "The projector lamp turns on and fan spins at high speed, but no display or HDMI signal is projected on the screen.",
    phoneNumber: "+919876543210",
    status: "OPEN",
    latitude: 18.520430,
    longitude: 73.856744,
    itemSnapshot: {
      itemName: "Projector #01",
      itemType: "Projector",
      building: "Main Academic Block",
      floor: "2",
      room: "A-203"
    },
    adminNotes: "",
    createdAt: "2026-09-16T10:15:00.000Z",
    updatedAt: "2026-09-16T10:15:00.000Z",
    closedAt: null,
    closedBy: null
  },
  {
    ticketId: "TKT-2026-000002",
    itemId: "AST-000003",
    ticketType: "Performance Problem",
    description: "Ceiling fan making loud grinding noise and vibrating vigorously at speed 4 and 5.",
    phoneNumber: "+919123456780",
    status: "CLOSED",
    latitude: 18.521150,
    longitude: 73.857320,
    itemSnapshot: {
      itemName: "Ceiling Fan #04",
      itemType: "Fan",
      building: "Science & CS Block",
      floor: "3",
      room: "B-301"
    },
    adminNotes: "Replaced faulty ball bearing and tightened blade screws. Tested working smoothly.",
    createdAt: "2026-09-14T08:30:00.000Z",
    updatedAt: "2026-09-15T14:20:00.000Z",
    closedAt: "2026-09-15T14:20:00.000Z",
    closedBy: "admin@campusfix.edu"
  },
  {
    ticketId: "TKT-2026-000003",
    itemId: "AST-000005",
    ticketType: "Cleaning Required",
    description: "Water tap filter requires replacement and drip tray is overflowing.",
    phoneNumber: "+919988776655",
    status: "OPEN",
    latitude: 18.519920,
    longitude: 73.856100,
    itemSnapshot: {
      itemName: "RO Water Cooler #01",
      itemType: "Water Cooler",
      building: "Library & Central Facility",
      floor: "1",
      room: "Corridor East"
    },
    adminNotes: "",
    createdAt: "2026-09-16T11:45:00.000Z",
    updatedAt: "2026-09-16T11:45:00.000Z",
    closedAt: null,
    closedBy: null
  }
];

export const TICKET_TYPES = [
  "Not Working",
  "Physical Damage",
  "Electrical Problem",
  "Performance Problem",
  "Cleaning Required",
  "Other"
];

export const INITIAL_ITEM_TYPES = [
  {
    type_id: "TYP-001",
    type_name: "Projector",
    type_code: "PRJ",
    type_description: "Classroom and auditorium digital projection units and visual display systems"
  },
  {
    type_id: "TYP-002",
    type_name: "Air Conditioner",
    type_code: "AC",
    type_description: "Split, window, and central HVAC air conditioning and cooling units"
  },
  {
    type_id: "TYP-003",
    type_name: "Ceiling Fan",
    type_code: "FAN",
    type_description: "High-speed ceiling fans and classroom ventilation equipment"
  },
  {
    type_id: "TYP-004",
    type_name: "Smart Board",
    type_code: "SMB",
    type_description: "Interactive touchscreen digital whiteboards and smart lecture displays"
  },
  {
    type_id: "TYP-005",
    type_name: "Water Cooler",
    type_code: "WTR",
    type_description: "RO purified drinking water coolers, filtration units, and dispensers"
  },
  {
    type_id: "TYP-006",
    type_name: "Lab Computer",
    type_code: "PC",
    type_description: "Desktop workstations, CPU towers, and dual monitors in campus laboratories"
  },
  {
    type_id: "TYP-007",
    type_name: "Network Switch",
    type_code: "NET",
    type_description: "Managed switches, Wi-Fi 6 access points, and rack network hardware"
  },
  {
    type_id: "TYP-008",
    type_name: "Audio System",
    type_code: "AUD",
    type_description: "Amplifiers, wireless microphones, and wall-mounted speakers"
  },
  {
    type_id: "TYP-009",
    type_name: "Printer / Scanner",
    type_code: "PRN",
    type_description: "Multi-function laser printers, photocopiers, and scanners"
  }
];

export const ASSET_TYPES = INITIAL_ITEM_TYPES.map((t) => t.type_name);

export const CAMPUS_BUILDINGS = [
  "Main IMCC Building",
  "BSM Junior College Building",
  "Senior College Building",
  "Knowledge Resource Center"
];

export const CAMPUS_FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor"
];

export const CAMPUS_ROOMS = [
  "Classroom 301",
  "Classroom 302",
  "Classroom 303",
  "Classroom 401",
  "Classroom 402",
  "Classroom 403",
  "Classroom 501",
  "Classroom 502",
  "Classroom 503",
  "Computer Lab 1",
  "Computer Lab 2",
  "Research Lab",
  "Exam Center",
  "Faculty Room 1",
  "Faculty Room 2",
  "Faculty Room 3"
];
