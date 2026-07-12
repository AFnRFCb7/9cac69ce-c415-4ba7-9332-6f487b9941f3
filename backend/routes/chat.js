
import { Router } from "express";
import { noVisaNoEsta, noVisaEstaRequired } from "../data/visaRules.js";

const router = Router();

import { countries } from "../data/countries.js";
import { countryNames } from "../data/countries.js";

const sessions = new Map();

function checkVisaRule(session) {
console.log(session);
  if (
    session.destination === "US" &&
    session.purpose === "TOURISM"
  ) {

    if (noVisaNoEsta.includes(session.nationality)) {
      return "NO_VISA_NO_ESTA";
    }

    if (noVisaEstaRequired.includes(session.nationality)) {
      return "NO_VISA_ESTA";
    }

    return "VISA_REQUIRED";
  }

  return "UNKNOWN";
}

function matches(text, values) {
  text = text.toLowerCase();

  return values.some(value =>
    text.includes(value.toLowerCase())
  );
}

function findCountry(text) {
  text = text.toLowerCase();

  for (const name of Object.keys(countries)) {
    if (text.includes(name)) {
      return countries[name];
    }
  }

  return null;
}

function matchesTourism(text) {
  return matches(text, [
    "tourism",
    "tourist",
    "vacation",
    "holiday",
    "tourismo",
    "turismo",
    "vacaciones",
    "旅游",
    "旅行"
  ]);
}

function matchesStudy(text) {
  return matches(text, [
    "student",
    "study",
    "school",
    "f1",
    "estudiante",
    "estudiar",
    "学生",
    "学习"
  ]);
}

router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      kind: "TEXT",
      variant: "I18N",
      key: "LOGIN_REQUIRED",
    });
  }

  const { locale, messages } = req.body;

  const last =
    messages[messages.length - 1].content.trim();

  let session = sessions.get(req.user.id);

if (!session) {
  session = {
    state: "START",
    destination: null,
    nationality: null,
    purpose: null,
  };

  sessions.set(req.user.id, session);
}

  switch (session.state) {

    case "START": {
      session.state = "ASK_DESTINATION";

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "ASK_DESTINATION",
      });
    }

case "ASK_DESTINATION": {

  const country = findCountry(last);


  if (!country) {
    return res.json({
      kind: "TEXT",
      variant: "I18N",
      key: "ASK_DESTINATION",
    });
  }


  if (country !== "US") {
    sessions.delete(req.user.id);
    session.state = "DONE";

    return res.json({
      kind: "TEXT",
      variant: "I18N",
      key: "UNSUPPORTED_DESTINATION",
      params: {
        country: last
      }
    });
  }

    session.destination = country;
  session.state = "ASK_NATIONALITY";

  return res.json({
    kind: "TEXT",
    variant: "I18N",
    key: "ASK_NATIONALITY",
  });
}

    case "ASK_NATIONALITY": {

      const country = findCountry(last);

      if (!country) {
        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "ASK_NATIONALITY",
        });
      }

      session.nationality = country;

      session.state = "ASK_PURPOSE";

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "ASK_PURPOSE",
      });
    }

    case "ASK_PURPOSE": {

      if (matchesStudy(last)) {
        session.purpose = "STUDY";
      } else if (matchesTourism(last)) {
        session.purpose = "TOURISM";
      } else {
        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "ASK_PURPOSE",
        });
      }
      if (session.purpose !== "TOURISM") {
        sessions.delete(req.user.id);

        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "UNSUPPORTED_PURPOSE",
          params: {
            purpose : last
          }
        });
      }
      const rule = checkVisaRule(session);
      console.log({rule});
      if(rule === "NO_VISA") {
        sessions.delete(req.user.id);
        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "NO_VISA_REQUIRED_ESTA",
          params: {
            nationality : countryNames[session.nationality] ,
            destination : countryNames[session.destination] ,
            nationalityNames : session.nationality ,
            destinationNames : session.destination
          }
        });
      } else if (rule === "NO_VISA_ESTA") {
        sessions.delete(req.user.id);
        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "NO_VISA_REQUIRED",
          params: {
            nationality : countryNames[session.nationality] ,
            destination : countryNames[session.destination]
          }
        });
      }

      sessions.delete(req.user.id);

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "VISA_GUIDE_PROMPT",
      });
    }

    default: {
      session.state = "START";

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "ASK_DESTINATION",
      });
    }
  }
});

export default router ;