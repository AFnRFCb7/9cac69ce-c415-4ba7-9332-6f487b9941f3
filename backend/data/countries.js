export const countries = {
  "afghanistan": "AF",
  "albania": "AL",
  "algeria": "DZ",
  "andorra": "AD",
  "angola": "AO",
  "antigua": "AG",
  "argentina": "AR",
  "armenia": "AM",
  "australia": "AU",
  "austria": "AT",
  "azerbaijan": "AZ",

  "bahamas": "BS",
  "bahrain": "BH",
  "bangladesh": "BD",
  "barbados": "BB",
  "belarus": "BY",
  "belgium": "BE",
  "belize": "BZ",
  "benin": "BJ",
  "bhutan": "BT",
  "bolivia": "BO",
  "bosnia": "BA",
  "botswana": "BW",
  "brazil": "BR",
  "brunei": "BN",
  "bulgaria": "BG",
  "burkina faso": "BF",
  "burundi": "BI",

  "cambodia": "KH",
  "cameroon": "CM",
  "canada": "CA",
  "cape verde": "CV",
  "chad": "TD",
  "chile": "CL",
  "china": "CN",
  "colombia": "CO",
  "costa rica": "CR",
  "croatia": "HR",
  "cuba": "CU",
  "cyprus": "CY",
  "czech republic": "CZ",
  "czechia": "CZ",

  "denmark": "DK",
  "dominican republic": "DO",

  "ecuador": "EC",
  "egypt": "EG",
  "el salvador": "SV",
  "estonia": "EE",
  "ethiopia": "ET",

  "fiji": "FJ",
  "finland": "FI",
  "france": "FR",

  "gabon": "GA",
  "gambia": "GM",
  "georgia": "GE",
  "germany": "DE",
  "ghana": "GH",
  "greece": "GR",
  "guatemala": "GT",
  "guinea": "GN",
  "guyana": "GY",

  "haiti": "HT",
  "honduras": "HN",
  "hungary": "HU",

  "iceland": "IS",
  "india": "IN",
  "indonesia": "ID",
  "iran": "IR",
  "iraq": "IQ",
  "ireland": "IE",
  "israel": "IL",
  "italy": "IT",

  "jamaica": "JM",
  "japan": "JP",
  "jordan": "JO",

  "kazakhstan": "KZ",
  "kenya": "KE",
  "kuwait": "KW",

  "laos": "LA",
  "latvia": "LV",
  "lebanon": "LB",
  "liberia": "LR",
  "libya": "LY",
  "lithuania": "LT",
  "luxembourg": "LU",

  "madagascar": "MG",
  "malaysia": "MY",
  "maldives": "MV",
  "mali": "ML",
  "malta": "MT",
  "mauritius": "MU",
  "mexico": "MX",
  "moldova": "MD",
  "monaco": "MC",
  "mongolia": "MN",
  "morocco": "MA",
  "mozambique": "MZ",

  "namibia": "NA",
  "nepal": "NP",
  "netherlands": "NL",
  "new zealand": "NZ",
  "nicaragua": "NI",
  "nigeria": "NG",
  "north korea": "KP",
  "north macedonia": "MK",
  "norway": "NO",

  "pakistan": "PK",
  "panama": "PA",
  "papua new guinea": "PG",
  "paraguay": "PY",
  "peru": "PE",
  "philippines": "PH",
  "poland": "PL",
  "portugal": "PT",

  "qatar": "QA",

  "romania": "RO",
  "russia": "RU",
  "rwanda": "RW",

  "saudi arabia": "SA",
  "senegal": "SN",
  "serbia": "RS",
  "singapore": "SG",
  "slovakia": "SK",
  "slovenia": "SI",
  "south africa": "ZA",
  "south korea": "KR",
  "spain": "ES",
  "sri lanka": "LK",
  "sweden": "SE",
  "switzerland": "CH",

  "taiwan": "TW",
  "tanzania": "TZ",
  "thailand": "TH",
  "tunisia": "TN",
  "turkey": "TR",
  "turkiye": "TR",

  "uganda": "UG",
  "ukraine": "UA",
  "united arab emirates": "AE",
  "united kingdom": "GB",
  "uruguay": "UY",
  "uzbekistan": "UZ",

  "venezuela": "VE",
  "vietnam": "VN",

  "yemen": "YE",

  "zambia": "ZM",
  "zimbabwe": "ZW",

  // aliases
  "usa": "US",
  "u.s.": "US",
  "u.s.a.": "US",
  "united states": "US",
  "america": "US",
};

export const countryNames = Object.fromEntries(
  Object.entries(countries)
    .filter(([name, code]) => {
      // Keep the first/common name only
      return !["usa", "u.s.", "u.s.a.", "america", "czechia", "turkiye"].includes(name);
    })
    .map(([name, code]) => [
      code,
      name
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ])
);