export const BOSTA_CITIES: Record<string, { id: string; name: string }> = {
  "القاهرة": { id: "FceDyHXwpSYYF9zGW", name: "Cairo" },
  "الجيزة": { id: "0064Qb0OgcA", name: "Giza" },
  "الإسكندرية": { id: "Jrb6X6ucjiYgMP4T7", name: "Alexandria" },
  "الشرقية": { id: "6ExcoGbpYHnggP8JD", name: "Sharqia" },
  "الدقهلية": { id: "RrDhS8YYsXAwZ9Zfo", name: "Dakahlia" },
  "البحيرة": { id: "g3GchTSmCgR2JynsJ", name: "Behira" },
  "المنيا": { id: "si6eLnKjXqTFTMBj9", name: "Menya" },
  "أسيوط": { id: "7mDPAohM3ArSZmWTm", name: "Assuit" },
  "سوهاج": { id: "n3EENg2adhuR9xBZK", name: "Sohag" },
  "قنا": { id: "vfTHTes3uGjAszgtg", name: "Qena" },
  "الأقصر": { id: "wgYEdH2WMzxGE2Ztp", name: "Luxor" },
  "أسوان": { id: "kLvZ5JY6LJPL5chzN", name: "Aswan" },
  "الفيوم": { id: "BW5MiNxEirB7tuz2y", name: "Fayoum" },
  "بني سويف": { id: "LzbbvTzZ7D2CgE2PL", name: "Bani Suif" },
  "المنوفية": { id: "ruBSjGBDX9wpRa3cc", name: "Monufia" },
  "الغربية": { id: "K3RwC677J8kJytdZD", name: "Gharbia" },
  "كفر الشيخ": { id: "ByP7rFCjL6XzF6j4S", name: "Kafr Alsheikh" },
  "دمياط": { id: "qoZvYcZ8Cqji4pGp5", name: "Damietta" },
  "بورسعيد": { id: "skFtf6ZmKo8kBEBDK", name: "Port Said" },
  "الإسماعيلية": { id: "PJqNriLtFtx2cfkKP", name: "Ismailia" },
  "السويس": { id: "PickurJ5uJZ9rDTHW", name: "Suez" },
  "شمال سيناء": { id: "ZuCaDAVQlPT", name: "North Sinai" },
  "جنوب سيناء": { id: "nG_c44vHQht", name: "South Sinai" },
  "البحر الأحمر": { id: "r5TscLCNSjR2GimxQ", name: "Red Sea" },
  "مطروح": { id: "KBpGiRZJMIx", name: "Matrouh" },
  "الوادي الجديد": { id: "w4yDVHVJWqa4HpbzA", name: "New Valley" },
};

export function getBostaCityData(gov: string) {
  const govTrimmed = (gov || "القاهرة").trim();
  return BOSTA_CITIES[govTrimmed] || BOSTA_CITIES["القاهرة"];
}
