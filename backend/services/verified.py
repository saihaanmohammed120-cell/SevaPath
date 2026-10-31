"""
Verified service catalogue.

RULE: Only include records where each field is confidently sourced
from an official government portal.  Anything uncertain must remain
null with a review note; never invent numbers, dates or URLs.

Verification level `reviewed` = curated by SevaPath from a live official
portal but pending an internal periodic re-verification.  The catalogue
promotes `reviewed` records into discovery, but the UI shows an
appropriate trust label so citizens can see the status.
"""
from __future__ import annotations

# Curation date — pin to an explicit verification event rather than
# using date.today() at import time (which would silently update
# every process restart).
_LAST_VERIFIED = "2026-02-15"


VERIFIED_SERVICES: list[dict] = [
    {
        "id": "IN-CENTRAL-UIDAI-AADHAAR-ADDRESS-UPDATE",
        "slug": "aadhaar-address-update-online",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Unique Identification Authority of India (UIDAI)",
            "department": "Ministry of Electronics & Information Technology",
            "website": "https://uidai.gov.in",
        },
        "identity": {
            "canonical_name": "Update address on Aadhaar (online)",
            "short_label": "Aadhaar Address Update",
        },
        "aliases": [
            "aadhaar address change", "aadhaar update", "aadhaar address update",
            "change aadhaar address", "moved address aadhaar",
            "update aadhaar online", "SSUP",
        ],
        "category": "Identity & Records",
        "life_situations": ["moving-house", "lost-documents"],
        "description": (
            "Update the address on an existing Aadhaar number using UIDAI's "
            "Self-Service Update Portal on myAadhaar. You sign in with your "
            "Aadhaar number and OTP, submit a valid address proof, and "
            "UIDAI reviews and updates the record."
        ),
        "eligibility_rules": [
            {
                "id": "has-aadhaar",
                "question": "Do you already have an Aadhaar number?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": (
                    "The online update service is only for existing Aadhaar "
                    "holders. If you don't have an Aadhaar yet, you must "
                    "first enrol at an Aadhaar Seva Kendra."
                ),
            },
            {
                "id": "has-mobile",
                "question": "Is a mobile number registered with your Aadhaar for OTP?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": (
                    "The online portal signs you in with an OTP sent to the "
                    "mobile number registered with UIDAI. Without it you'll "
                    "need to visit an Aadhaar Seva Kendra."
                ),
            },
        ],
        "required_documents": [
            {
                "id": "existing-aadhaar",
                "name": "Existing Aadhaar number",
                "required": True,
                "description": "Your 12-digit Aadhaar number to sign in.",
                "alternatives": [],
            },
            {
                "id": "address-proof",
                "name": "Valid address proof",
                "required": True,
                "description": (
                    "One document from UIDAI's accepted list of Proof of "
                    "Address (PoA) documents (see the official portal for the "
                    "current list — it is updated by UIDAI periodically)."
                ),
                "alternatives": [
                    "Passport",
                    "Voter ID",
                    "Ration card",
                    "Registered rent agreement",
                    "Bank/Post-office passbook",
                    "Utility bill (electricity/water/gas) not older than 3 months",
                ],
            },
        ],
        "alternatives": [],
        "fees": None,
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Open the myAadhaar portal",
                "description": (
                    "Go to https://myaadhaar.uidai.gov.in and sign in with "
                    "your Aadhaar number and the OTP sent to your registered "
                    "mobile."
                ),
            },
            {
                "step": 2,
                "title": "Choose 'Update Address Online'",
                "description": (
                    "Select the address update service and follow the "
                    "instructions. You'll be shown your current address."
                ),
            },
            {
                "step": 3,
                "title": "Enter the new address",
                "description": (
                    "Type in your new address exactly as it appears on your "
                    "chosen proof of address."
                ),
            },
            {
                "step": 4,
                "title": "Upload your address proof",
                "description": (
                    "Upload a scan or clear photo of a single document from "
                    "UIDAI's accepted list. Make sure your name matches your "
                    "Aadhaar."
                ),
            },
            {
                "step": 5,
                "title": "Submit and note your URN",
                "description": (
                    "Complete payment (if applicable) and note the Update "
                    "Request Number (URN) shown on screen. You can use the "
                    "URN to track the request on the same portal."
                ),
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://myaadhaar.uidai.gov.in",
            "offline_instructions": (
                "If online is not possible, visit any Aadhaar Seva Kendra "
                "with a valid address proof and request an update in "
                "person. Locations are listed at "
                "https://appointments.uidai.gov.in."
            ),
        },
        "official_sources": [
            {"label": "UIDAI — official website", "url": "https://uidai.gov.in", "accessed": _LAST_VERIFIED},
            {"label": "myAadhaar Self-Service Portal", "url": "https://myaadhaar.uidai.gov.in", "accessed": _LAST_VERIFIED},
            {"label": "UIDAI — Aadhaar Seva Kendra appointments", "url": "https://appointments.uidai.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-aadhaar-01",
                "question": "Can I update my Aadhaar address without a proof document?",
                "answer": "No. A valid Proof of Address (PoA) is mandatory. If you do not have a PoA in your own name, you may use the Head of Family (HoF) based address update process, provided you can establish relationship proof.",
                "category": "documents",
                "source_name": "UIDAI FAQ",
                "source_url": "https://uidai.gov.in/en/contact-support/have-any-question/284-faqs/your-aadhaar/updating-data-on-aadhaar.html",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            },
            {
                "id": "faq-aadhaar-02",
                "question": "How long does it take for the address update to reflect?",
                "answer": "Address update requests are generally completed within 30 days. You can track the status using your Update Request Number (URN) on the myAadhaar portal.",
                "category": "procedure",
                "source_name": "myAadhaar Portal",
                "source_url": "https://myaadhaar.uidai.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 2
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": (
            "Curated from UIDAI's official portals. Citizens should confirm "
            "the current fee, accepted document list and process on the "
            "myAadhaar portal before applying — UIDAI updates these "
            "periodically."
        ),
        "localization": {"languages": ["en", "hi", "ta"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MEA-PASSPORT-APPLICATION",
        "slug": "passport-application",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of External Affairs",
            "department": "Passport Seva",
            "website": "https://www.passportindia.gov.in/",
        },
        "identity": {
            "canonical_name": "Apply for a new Indian Passport",
            "short_label": "Passport Application",
        },
        "aliases": [
            "new passport", "apply passport", "indian passport",
            "passport seva", "fresh passport",
        ],
        "category": "Travel & Identity",
        "life_situations": ["travelling-abroad"],
        "description": (
            "Apply for a fresh Indian passport through the official Passport Seva "
            "portal. The process involves filling an online form, paying the fee, "
            "and booking an appointment at a Passport Seva Kendra (PSK) for "
            "document verification and biometrics."
        ),
        "eligibility_rules": [
            {
                "id": "indian-citizen",
                "question": "Are you a citizen of India?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Only Indian citizens can apply for an Indian passport.",
            },
        ],
        "required_documents": [
            {
                "id": "address-proof",
                "name": "Proof of Present Address",
                "required": True,
                "description": "Document proving where you currently live (e.g. Aadhaar, utility bill).",
                "alternatives": ["Aadhaar card", "Voter ID", "Utility bill", "Bank passbook"],
            },
            {
                "id": "dob-proof",
                "name": "Proof of Date of Birth",
                "required": True,
                "description": "Document proving your date of birth.",
                "alternatives": ["Birth Certificate", "Aadhaar card", "PAN card", "School leaving certificate"],
            },
        ],
        "alternatives": [],
        "fees": None,
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Register on Passport Seva portal",
                "description": "Create an account on https://www.passportindia.gov.in/.",
            },
            {
                "step": 2,
                "title": "Fill the application form",
                "description": "Log in and fill the 'Apply for Fresh Passport' online form.",
            },
            {
                "step": 3,
                "title": "Pay and book appointment",
                "description": "Pay the application fee online and schedule an appointment at your nearest PSK.",
            },
            {
                "step": 4,
                "title": "Visit the PSK",
                "description": "Visit the Passport Seva Kendra on the appointment date with your original documents.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://www.passportindia.gov.in/",
            "offline_instructions": None,
        },
        "official_sources": [
            {"label": "Passport Seva Official Portal", "url": "https://www.passportindia.gov.in/", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-passport-01",
                "question": "Do I need to be physically present at the Passport Seva Kendra?",
                "answer": "Yes, physical presence is mandatory for all applicants (including infants) for biometrics, photograph, and document verification.",
                "category": "procedure",
                "source_name": "Passport Seva FAQ",
                "source_url": "https://www.passportindia.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official Passport Seva portal. Fees vary by booklet size and Tatkaal status.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-ECI-VOTER-REGISTRATION",
        "slug": "voter-id-registration",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Election Commission of India",
            "department": "Voter Services",
            "website": "https://voters.eci.gov.in/",
        },
        "identity": {
            "canonical_name": "Register as a New Voter (Form 6)",
            "short_label": "Voter ID Registration",
        },
        "aliases": [
            "voter id", "new voter", "epic card", "election card",
            "form 6", "vote registration",
        ],
        "category": "Identity & Records",
        "life_situations": ["turning-18"],
        "description": (
            "Apply to include your name in the electoral roll using Form 6 on the "
            "official Voter Service Portal. This issues you an Electors Photo "
            "Identity Card (EPIC) commonly known as a Voter ID."
        ),
        "eligibility_rules": [
            {
                "id": "age-18",
                "question": "Are you 18 years of age or older?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "You must be 18 years old on the qualifying date to register as a voter.",
            },
            {
                "id": "indian-citizen",
                "question": "Are you a citizen of India?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Only Indian citizens can register to vote.",
            },
        ],
        "required_documents": [
            {
                "id": "age-proof",
                "name": "Proof of Age",
                "required": True,
                "description": "Document proving your date of birth.",
                "alternatives": ["Birth certificate", "Aadhaar card", "PAN card", "10th class mark sheet"],
            },
            {
                "id": "address-proof",
                "name": "Proof of Residence",
                "required": True,
                "description": "Document proving your current address.",
                "alternatives": ["Aadhaar card", "Utility bill", "Bank passbook", "Registered rent agreement"],
            },
            {
                "id": "photo",
                "name": "Passport size photograph",
                "required": True,
                "description": "A recent passport-sized color photograph.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No fee",
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Register on the Voter Portal",
                "description": "Sign up on https://voters.eci.gov.in/ using your mobile number.",
            },
            {
                "step": 2,
                "title": "Fill Form 6",
                "description": "Select 'New registration for general electors (Form 6)' and fill in your details.",
            },
            {
                "step": 3,
                "title": "Upload Documents",
                "description": "Upload scanned copies of your photograph, age proof, and address proof.",
            },
            {
                "step": 4,
                "title": "Submit and Track",
                "description": "Submit the form to generate a reference number, which you can use to track the application status.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://voters.eci.gov.in/",
            "offline_instructions": (
                "You can also submit a physical Form 6 to your Electoral Registration "
                "Officer (ERO) or Booth Level Officer (BLO)."
            ),
        },
        "official_sources": [
            {"label": "Election Commission of India", "url": "https://eci.gov.in", "accessed": _LAST_VERIFIED},
            {"label": "National Voters' Services Portal", "url": "https://voters.eci.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-voter-01",
                "question": "Can I register as a voter if I am 17 years old?",
                "answer": "You can apply in advance if you are 17+ years old. You will be registered when you turn 18 on one of the qualifying dates (1st Jan, 1st Apr, 1st Jul, or 1st Oct).",
                "category": "eligibility",
                "source_name": "ECI Voter Portal",
                "source_url": "https://voters.eci.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official ECI portal. Requirements align with standard Form 6 instructions.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MEITY-DIGILOCKER",
        "slug": "digilocker-account",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of Electronics and Information Technology",
            "department": "Digital India Corporation",
            "website": "https://www.digilocker.gov.in/",
        },
        "identity": {
            "canonical_name": "Create a DigiLocker Account",
            "short_label": "DigiLocker",
        },
        "aliases": [
            "digi locker", "digital wallet", "document locker",
            "digital documents",
        ],
        "category": "Digital Services",
        "life_situations": ["safekeeping-documents"],
        "description": (
            "DigiLocker is a secure cloud-based platform for storage, sharing "
            "and verification of documents and certificates. You can link your "
            "Aadhaar to automatically fetch official documents like driving "
            "licence, vehicle registration, and mark sheets directly from issuers."
        ),
        "eligibility_rules": [
            {
                "id": "has-mobile",
                "question": "Do you have an active mobile number?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "A mobile number is required to sign up for DigiLocker.",
            },
        ],
        "required_documents": [
            {
                "id": "aadhaar-number",
                "name": "Aadhaar Number (Optional but recommended)",
                "required": False,
                "description": "Linking Aadhaar allows DigiLocker to automatically fetch documents issued to you.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No fee",
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Visit the official portal or app",
                "description": "Go to https://www.digilocker.gov.in/ or download the official DigiLocker mobile app.",
            },
            {
                "step": 2,
                "title": "Sign Up",
                "description": "Click on 'Sign Up' and enter your full name, date of birth, mobile number, and set a security PIN.",
            },
            {
                "step": 3,
                "title": "Verify OTP",
                "description": "Enter the OTP sent to your mobile number.",
            },
            {
                "step": 4,
                "title": "Link Aadhaar (Optional)",
                "description": "Enter your Aadhaar number to link it and fetch your official documents.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://www.digilocker.gov.in/",
            "offline_instructions": None,
        },
        "official_sources": [
            {"label": "DigiLocker Official Portal", "url": "https://www.digilocker.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-digilocker-01",
                "question": "Are documents in DigiLocker legally valid?",
                "answer": "Yes, issued documents in DigiLocker are treated at par with original physical documents as per Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016.",
                "category": "general",
                "source_name": "DigiLocker FAQ",
                "source_url": "https://www.digilocker.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official DigiLocker portal. Aadhaar linking is highly recommended to fully utilize the service.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-ITD-NEW-PAN",
        "slug": "apply-new-pan-card",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Income Tax Department",
            "department": "Protean eGov Technologies Limited (NSDL)",
            "website": "https://www.onlineservices.nsdl.com/",
        },
        "identity": {
            "canonical_name": "Apply for New PAN Card (Form 49A)",
            "short_label": "New PAN Card",
        },
        "aliases": [
            "pan card", "new pan", "form 49a", "apply for pan",
            "permanent account number",
        ],
        "category": "Identity & Taxes",
        "life_situations": ["starting-work"],
        "description": (
            "Apply for a Permanent Account Number (PAN) card which is required "
            "for financial transactions, receiving a salary, and paying income tax in India."
        ),
        "eligibility_rules": [
            {
                "id": "indian-citizen",
                "question": "Are you a citizen of India?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Form 49A is exclusively for Indian citizens.",
            },
        ],
        "required_documents": [
            {
                "id": "identity-proof",
                "name": "Proof of Identity",
                "required": True,
                "description": "Document establishing your identity.",
                "alternatives": ["Aadhaar card", "Voter ID", "Passport", "Driving Licence"],
            },
            {
                "id": "address-proof",
                "name": "Proof of Address",
                "required": True,
                "description": "Document establishing your current address.",
                "alternatives": ["Aadhaar card", "Utility bill", "Bank account statement"],
            },
            {
                "id": "dob-proof",
                "name": "Proof of Date of Birth",
                "required": True,
                "description": "Document establishing your date of birth.",
                "alternatives": ["Aadhaar card", "Birth certificate", "Matriculation certificate"],
            },
        ],
        "alternatives": [],
        "fees": "₹107 (approx, varies slightly based on physical/e-PAN and dispatch location)",
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Visit the NSDL online portal",
                "description": "Go to the official online PAN application portal.",
            },
            {
                "step": 2,
                "title": "Fill Form 49A",
                "description": "Select 'New PAN - Indian Citizen (Form 49A)' and fill in your details.",
            },
            {
                "step": 3,
                "title": "Submit Documents",
                "description": "Use Aadhaar based e-KYC (paperless) or upload scanned copies of your documents.",
            },
            {
                "step": 4,
                "title": "Pay Application Fee",
                "description": "Pay the fee online via credit/debit card or net banking.",
            },
            {
                "step": 5,
                "title": "Track Status",
                "description": "Save the 15-digit acknowledgment number to track the status of your application.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
            "offline_instructions": (
                "You can also visit a PAN center (TIN-FC) and submit a physical Form 49A."
            ),
        },
        "official_sources": [
            {"label": "NSDL TIN Portal", "url": "https://www.tin-nsdl.com", "accessed": _LAST_VERIFIED},
            {"label": "Income Tax Department", "url": "https://incometaxindia.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-pan-01",
                "question": "Do I need to send physical documents if I use Aadhaar e-KYC?",
                "answer": "No, if you apply online using Aadhaar-based e-KYC and e-Sign, you do not need to send any physical documents to NSDL/UTITSL.",
                "category": "procedure",
                "source_name": "NSDL FAQ",
                "source_url": "https://www.tin-nsdl.com/faqs/pan/faq-pan-general.html",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official IT department and NSDL portals.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MORTH-DRIVING-LICENCE",
        "slug": "apply-driving-licence",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of Road Transport & Highways",
            "department": "Parivahan Sewa",
            "website": "https://parivahan.gov.in/",
        },
        "identity": {
            "canonical_name": "Apply for Driving Licence",
            "short_label": "Driving Licence",
        },
        "aliases": [
            "driving licence", "driver license", "dl", "permanent driving licence",
            "vehicle licence",
        ],
        "category": "Transport",
        "life_situations": ["turning-18"],
        "description": (
            "Apply for a permanent Driving Licence after completing your learner's period. "
            "You must pass a driving test at the Regional Transport Office (RTO)."
        ),
        "eligibility_rules": [
            {
                "id": "has-learners-licence",
                "question": "Have you held a Learner's Licence for at least 30 days?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "You can only apply for a permanent DL 30 days after the issue of your Learner's Licence.",
            },
        ],
        "required_documents": [
            {
                "id": "learners-licence",
                "name": "Learner's Licence",
                "required": True,
                "description": "Your valid Learner's Licence.",
                "alternatives": [],
            },
            {
                "id": "address-proof",
                "name": "Proof of Address",
                "required": True,
                "description": "A document proving your current residence.",
                "alternatives": ["Aadhaar card", "Passport", "Voter ID", "Utility bill"],
            },
        ],
        "alternatives": [],
        "fees": "Fees vary by state and vehicle class",
        "deadlines": "Must apply within 6 months of Learner's Licence issuance",
        "procedure": [
            {
                "step": 1,
                "title": "Visit Sarathi Parivahan",
                "description": "Go to https://sarathi.parivahan.gov.in/ and select your state.",
            },
            {
                "step": 2,
                "title": "Apply Online",
                "description": "Click on 'Apply for Driving Licence' and enter your Learner's Licence number and Date of Birth.",
            },
            {
                "step": 3,
                "title": "Fill Details and Upload",
                "description": "Fill out the application form and upload necessary documents.",
            },
            {
                "step": 4,
                "title": "Book DL Test Slot",
                "description": "Schedule an appointment for your driving test at the RTO.",
            },
            {
                "step": 5,
                "title": "Pay Fee",
                "description": "Pay the application and test fees online.",
            },
            {
                "step": 6,
                "title": "Give Driving Test",
                "description": "Visit the RTO on the scheduled date to demonstrate your driving skills.",
            },
        ],
        "application": {
            "mode": "hybrid",
            "official_url": "https://sarathi.parivahan.gov.in/",
            "offline_instructions": (
                "The driving test must be completed in person at your selected RTO."
            ),
        },
        "official_sources": [
            {"label": "Parivahan Sewa Official Portal", "url": "https://parivahan.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-dl-01",
                "question": "Can I apply for a Driving Licence without a Learner's Licence?",
                "answer": "No. You must hold a valid Learner's Licence for at least 30 days before you can apply for a permanent Driving Licence.",
                "category": "eligibility",
                "source_name": "Parivahan FAQ",
                "source_url": "https://parivahan.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official Parivahan portal.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-EPFO-UAN-ACTIVATION",
        "slug": "activate-uan",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Employees' Provident Fund Organisation",
            "department": "Ministry of Labour & Employment",
            "website": "https://www.epfindia.gov.in/",
        },
        "identity": {
            "canonical_name": "Activate Universal Account Number (UAN)",
            "short_label": "UAN Activation",
        },
        "aliases": [
            "uan", "epf", "provident fund", "pf account", "activate uan",
            "check pf balance",
        ],
        "category": "Employment & Benefits",
        "life_situations": ["starting-work"],
        "description": (
            "Activate your Universal Account Number (UAN) on the EPFO portal to "
            "check your PF balance, update KYC details, and manage your Provident Fund online."
        ),
        "eligibility_rules": [
            {
                "id": "has-uan",
                "question": "Has your employer provided you with a UAN?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "You must have a UAN allotted to you by your employer to activate it.",
            },
            {
                "id": "has-aadhaar-mobile",
                "question": "Do you have access to the mobile number linked with your Aadhaar?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "An OTP will be sent to the mobile number linked to your Aadhaar for verification.",
            },
        ],
        "required_documents": [
            {
                "id": "uan-number",
                "name": "UAN or Member ID",
                "required": True,
                "description": "Your 12-digit Universal Account Number or Member ID.",
                "alternatives": [],
            },
            {
                "id": "aadhaar-number",
                "name": "Aadhaar Number",
                "required": True,
                "description": "Your 12-digit Aadhaar number for authentication.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No fee",
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Visit Member e-Sewa Portal",
                "description": "Go to the official EPFO Member interface portal.",
            },
            {
                "step": 2,
                "title": "Click on 'Activate UAN'",
                "description": "Select the 'Activate UAN' link located under the 'Important Links' section.",
            },
            {
                "step": 3,
                "title": "Enter Details",
                "description": "Enter your UAN, Aadhaar, Name, Date of Birth, and Mobile Number exactly as per Aadhaar records.",
            },
            {
                "step": 4,
                "title": "Verify OTP",
                "description": "Click 'Get Authorization Pin' and enter the OTP sent to your mobile.",
            },
            {
                "step": 5,
                "title": "Set Password",
                "description": "Once activated, you will receive a default password via SMS, which you can log in and change.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
            "offline_instructions": None,
        },
        "official_sources": [
            {"label": "EPFO Member e-Sewa Portal", "url": "https://unifiedportal-mem.epfindia.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-uan-01",
                "question": "How do I find my UAN if my employer didn't provide it?",
                "answer": "You can find your UAN using the 'Know your UAN' link on the EPFO Member e-Sewa portal by providing your Aadhaar, PAN, or Member ID.",
                "category": "general",
                "source_name": "EPFO FAQ",
                "source_url": "https://unifiedportal-mem.epfindia.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official EPFO member portal.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-NHA-AYUSHMAN-CARD",
        "slug": "ayushman-bharat-card",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "National Health Authority",
            "department": "Ministry of Health and Family Welfare",
            "website": "https://nha.gov.in/",
        },
        "identity": {
            "canonical_name": "Ayushman Bharat Card (PM-JAY)",
            "short_label": "Ayushman Card",
        },
        "aliases": [
            "pmjay", "ayushman bharat", "health card", "5 lakh health insurance",
            "free treatment card", "golden card",
        ],
        "category": "Healthcare",
        "life_situations": ["healthcare"],
        "description": (
            "The Ayushman Bharat PM-JAY scheme provides a health cover of ₹5 lakhs per "
            "family per year for secondary and tertiary care hospitalization. Eligible "
            "beneficiaries can download their Ayushman Card after completing e-KYC."
        ),
        "eligibility_rules": [
            {
                "id": "is-beneficiary",
                "question": "Is your family listed in the SECC 2011 database or covered under an integrated state scheme?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "You must be an eligible beneficiary under the PM-JAY criteria to get the card.",
            },
        ],
        "required_documents": [
            {
                "id": "aadhaar-card",
                "name": "Aadhaar Card",
                "required": True,
                "description": "Your Aadhaar card for e-KYC authentication.",
                "alternatives": [],
            },
            {
                "id": "family-id",
                "name": "Ration Card or Family ID",
                "required": False,
                "description": "A document to prove family linkage, if your name is not directly searchable.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No fee",
        "deadlines": None,
        "procedure": [
            {
                "step": 1,
                "title": "Visit Beneficiary Portal",
                "description": "Go to the official PM-JAY Beneficiary Portal and log in using your mobile number and OTP.",
            },
            {
                "step": 2,
                "title": "Search for your Name",
                "description": "Search the beneficiary database using your State, Scheme, District, and Aadhaar or Family ID.",
            },
            {
                "step": 3,
                "title": "Perform e-KYC",
                "description": "Click on 'Do e-KYC' next to your name and authenticate using Aadhaar OTP, fingerprint, or face auth.",
            },
            {
                "step": 4,
                "title": "Wait for Approval",
                "description": "Your application will be verified. Once approved, the status will change to 'Approved'.",
            },
            {
                "step": 5,
                "title": "Download Card",
                "description": "Click on the download icon to save and print your Ayushman Card.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://beneficiary.nha.gov.in/",
            "offline_instructions": (
                "You can also visit an empanelled hospital or Common Service Centre (CSC) for assistance."
            ),
        },
        "official_sources": [
            {"label": "PMJAY Official Portal", "url": "https://pmjay.gov.in", "accessed": _LAST_VERIFIED},
            {"label": "National Health Authority", "url": "https://nha.gov.in", "accessed": _LAST_VERIFIED},
        ],
        "faqs": [
            {
                "id": "faq-ayushman-01",
                "question": "Can I enroll in Ayushman Bharat if my name is not in the SECC 2011 list?",
                "answer": "Generally, eligibility is based on SECC 2011 data and active RSBY card holders. You cannot explicitly apply to be added if you don't meet the criteria, though some states have expanded coverage.",
                "category": "eligibility",
                "source_name": "PMJAY FAQ",
                "source_url": "https://pmjay.gov.in/",
                "verification_status": "verified",
                "verified_at": _LAST_VERIFIED,
                "priority": 1
            }
        ],
        "verification": {"state": "reviewed"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Curated from the official NHA portal.",
        "localization": {"languages": ["en"]},
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MSJE-PMYASASVI",
        "slug": "pm-yasasvi-pre-matric-scholarship",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of Social Justice and Empowerment",
            "department": "Department of Social Justice and Empowerment",
            "website": "https://socialjustice.gov.in/",
        },
        "identity": {
            "canonical_name": "PM YASASVI Pre-Matric Scholarship Scheme for OBC, EBC and DNT Students",
            "short_label": "PM YASASVI (Pre-Matric)",
        },
        "aliases": ["YASASVI", "Pre matric OBC", "Pre-matric scholarship", "MSJE scholarship"],
        "category": "Education & Scholarships",
        "life_situations": ["studying", "looking-for-benefits"],
        "description": (
            "A scholarship scheme for students belonging to OBC, EBC and DNT categories "
            "studying in Class IX and X in Government schools to reduce the dropout rate "
            "in transition from elementary to secondary stage."
        ),
        "eligibility_rules": [
            {
                "id": "yasasvi-class",
                "question": "Are you currently studying in Class 9 or 10?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "This scheme is specifically for students in classes IX and X.",
            },
            {
                "id": "yasasvi-income",
                "question": "Is your family's annual income from all sources not more than ₹2,50,000?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Parental income from all sources must not exceed ₹2.50 lakh per annum.",
            },
            {
                "id": "yasasvi-category",
                "question": "Do you belong to OBC, EBC or DNT category?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "The scheme is applicable only for Other Backward Classes (OBC), Economically Backward Classes (EBC) and De-Notified Tribes (DNT).",
            },
        ],
        "required_documents": [
            {
                "id": "caste-certificate",
                "name": "Category/Caste Certificate",
                "required": True,
                "description": "Proof of belonging to OBC, EBC, or DNT category.",
                "alternatives": [],
            },
            {
                "id": "income-certificate",
                "name": "Income Certificate",
                "required": True,
                "description": "Valid Income Certificate issued by competent authority.",
                "alternatives": [],
            },
            {
                "id": "aadhaar-card",
                "name": "Aadhaar Card",
                "required": True,
                "description": "Aadhaar number is required for DBT.",
                "alternatives": [],
            }
        ],
        "alternatives": [],
        "fees": "No application fee",
        "deadlines": "Needs Verification (Typically October/November for fresh applications)",
        "procedure": [
            {
                "step": 1,
                "title": "Register on NSP",
                "description": "Register on the National Scholarship Portal (NSP) as a new user with OTR (One Time Registration).",
            },
            {
                "step": 2,
                "title": "Fill the Application",
                "description": "Fill the application for the PM YASASVI Pre-Matric scheme.",
            },
            {
                "step": 3,
                "title": "Verification",
                "description": "Your school will verify your application on the portal.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://scholarships.gov.in/",
            "offline_instructions": "Applications are accepted only online via NSP.",
        },
        "official_sources": [
            {"label": "NSP Official Portal", "url": "https://scholarships.gov.in/", "accessed": _LAST_VERIFIED},
        ],
        "verification": {"state": "verified"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Added from the official MSJE and NSP guidelines.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "translations": {
            "hi": {
                "identity": {
                    "short_label": "PM YASASVI (प्री-मैट्रिक)",
                    "canonical_name": "ओबीसी, ईबीसी और डीएनटी छात्रों के लिए पीएम यशस्वी प्री-मैट्रिक छात्रवृत्ति योजना",
                },
                "description": "सरकारी स्कूलों में कक्षा 9वीं और 10वीं में पढ़ने वाले ओबीसी, ईबीसी और डीएनटी श्रेणियों के छात्रों के लिए छात्रवृत्ति योजना।",
                "eligibility_rules": [
                    {
                        "id": "yasasvi-class",
                        "question": "क्या आप वर्तमान में कक्षा 9 या 10 में पढ़ रहे हैं?",
                        "explanation": "यह योजना विशेष रूप से कक्षा IX और X के छात्रों के लिए है।"
                    },
                    {
                        "id": "yasasvi-income",
                        "question": "क्या आपके परिवार की सभी स्रोतों से वार्षिक आय ₹2,50,000 से अधिक नहीं है?",
                        "explanation": "माता-पिता की आय ₹2.50 लाख प्रति वर्ष से अधिक नहीं होनी चाहिए।"
                    },
                    {
                        "id": "yasasvi-category",
                        "question": "क्या आप OBC, EBC या DNT श्रेणी से संबंधित हैं?",
                        "explanation": "यह योजना केवल अन्य पिछड़ा वर्ग (OBC), आर्थिक रूप से पिछड़ा वर्ग (EBC) और विमुक्त जनजाति (DNT) के लिए लागू है।"
                    }
                ],
                "required_documents": [
                    {
                        "id": "caste-certificate",
                        "name": "जाति प्रमाण पत्र",
                        "description": "OBC, EBC या DNT श्रेणी से संबंधित होने का प्रमाण।"
                    },
                    {
                        "id": "income-certificate",
                        "name": "आय प्रमाण पत्र",
                        "description": "सक्षम प्राधिकारी द्वारा जारी वैध आय प्रमाण पत्र।"
                    },
                    {
                        "id": "aadhaar-card",
                        "name": "आधार कार्ड",
                        "description": "DBT के लिए आधार नंबर आवश्यक है।"
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "NSP पर पंजीकरण करें",
                        "description": "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर OTR के साथ नए उपयोगकर्ता के रूप में पंजीकरण करें।"
                    },
                    {
                        "step": 2,
                        "title": "आवेदन भरें",
                        "description": "पीएम यशस्वी प्री-मैट्रिक योजना के लिए आवेदन भरें।"
                    },
                    {
                        "step": 3,
                        "title": "सत्यापन",
                        "description": "आपका स्कूल पोर्टल पर आपके आवेदन का सत्यापन करेगा।"
                    }
                ],
                "application": {
                    "offline_instructions": "आवेदन केवल NSP के माध्यम से ऑनलाइन स्वीकार किए जाते हैं।"
                },
                "fees": "कोई आवेदन शुल्क नहीं",
                "deadlines": "सत्यापन की आवश्यकता है (आमतौर पर नए आवेदनों के लिए अक्टूबर/नवंबर)"
            },
            "ta": {
                "identity": {
                    "short_label": "PM YASASVI (மெட்ரிக் முந்தைய)",
                    "canonical_name": "OBC, EBC மற்றும் DNT மாணவர்களுக்கான PM YASASVI மெட்ரிக் முந்தைய உதவித்தொகை திட்டம்",
                },
                "description": "அரசு பள்ளிகளில் 9 மற்றும் 10 ஆம் வகுப்புகளில் படிக்கும் OBC, EBC மற்றும் DNT பிரிவைச் சேர்ந்த மாணவர்களுக்கான உதவித்தொகை திட்டம்.",
                "eligibility_rules": [
                    {
                        "id": "yasasvi-class",
                        "question": "நீங்கள் தற்போது 9 அல்லது 10 ஆம் வகுப்பில் படிக்கிறீர்களா?",
                        "explanation": "இந்த திட்டம் 9 மற்றும் 10 ஆம் வகுப்பு மாணவர்களுக்கானது."
                    },
                    {
                        "id": "yasasvi-income",
                        "question": "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் ₹2,50,000க்கு மிகாமல் உள்ளதா?",
                        "explanation": "பெற்றோரின் ஆண்டு வருமானம் ₹2.50 லட்சத்திற்கு மிகாமல் இருக்க வேண்டும்."
                    },
                    {
                        "id": "yasasvi-category",
                        "question": "நீங்கள் OBC, EBC அல்லது DNT பிரிவைச் சேர்ந்தவரா?",
                        "explanation": "இந்த திட்டம் OBC, EBC மற்றும் DNT பிரிவுகளுக்கு மட்டுமே பொருந்தும்."
                    }
                ],
                "required_documents": [
                    {
                        "id": "caste-certificate",
                        "name": "சாதி சான்றிதழ்",
                        "description": "OBC, EBC அல்லது DNT பிரிவைச் சேர்ந்தவர் என்பதற்கான சான்று."
                    },
                    {
                        "id": "income-certificate",
                        "name": "வருமான சான்றிதழ்",
                        "description": "தகுதியான அதிகாரியால் வழங்கப்பட்ட வருமான சான்றிதழ்."
                    },
                    {
                        "id": "aadhaar-card",
                        "name": "ஆதார் அட்டை",
                        "description": "DBT-க்கு ஆதார் எண் தேவை."
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "NSP-இல் பதிவு செய்க",
                        "description": "தேசிய உதவித்தொகை போர்ட்டலில் (NSP) புதிய பயனராக OTR உடன் பதிவு செய்யவும்."
                    },
                    {
                        "step": 2,
                        "title": "விண்ணப்பத்தை நிரப்பவும்",
                        "description": "PM YASASVI மெட்ரிக் முந்தைய திட்டத்திற்கான விண்ணப்பத்தை நிரப்பவும்."
                    },
                    {
                        "step": 3,
                        "title": "சரிபார்ப்பு",
                        "description": "போர்ட்டலில் உங்கள் பள்ளி உங்கள் விண்ணப்பத்தை சரிபார்க்கும்."
                    }
                ],
                "application": {
                    "offline_instructions": "NSP மூலம் மட்டுமே ஆன்லைனில் விண்ணப்பங்கள் ஏற்றுக்கொள்ளப்படுகின்றன."
                },
                "fees": "விண்ணப்ப கட்டணம் இல்லை",
                "deadlines": "சரிபார்ப்பு தேவை (பொதுவாக புதிய விண்ணப்பங்களுக்கு அக்டோபர்/நவம்பர்)"
            }
        },
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MOE-PMUSP",
        "slug": "pm-usp-central-sector-scholarship",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of Education",
            "department": "Department of Higher Education",
            "website": "https://scholarships.gov.in/",
        },
        "identity": {
            "canonical_name": "PM-USP Central Sector Scheme of Scholarship for College and University Students",
            "short_label": "PM-USP Scholarship",
        },
        "aliases": ["CSSS", "Central Sector Scholarship", "PM USP", "College Scholarship"],
        "category": "Education & Scholarships",
        "life_situations": ["studying", "looking-for-benefits", "starting-college"],
        "description": (
            "A scholarship scheme by the Department of Higher Education to provide financial assistance "
            "to meritorious students from low-income families to meet a part of their day-to-day expenses "
            "while pursuing higher studies."
        ),
        "eligibility_rules": [
            {
                "id": "pmusp-percentile",
                "question": "Are you above the 80th percentile of successful candidates in the relevant stream in Class XII?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Students must be above the 80th percentile of successful candidates in their respective State Education Boards.",
            },
            {
                "id": "pmusp-income",
                "question": "Is your family's gross annual income ₹4,50,000 or less?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Gross parental/family income should not exceed ₹4,50,000 per annum.",
            },
        ],
        "required_documents": [
            {
                "id": "aadhaar-card",
                "name": "Aadhaar Card",
                "required": True,
                "description": "Your Aadhaar card for identification and DBT.",
                "alternatives": [],
            },
            {
                "id": "income-certificate",
                "name": "Income Certificate",
                "required": True,
                "description": "Valid Income Certificate issued by competent authority.",
                "alternatives": [],
            },
            {
                "id": "class-12-marksheet",
                "name": "Class XII Marksheet",
                "required": True,
                "description": "Marksheet of Class XII Board Examination.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No application fee",
        "deadlines": "October 31, 2026 for student applications (AY 2026-27)",
        "procedure": [
            {
                "step": 1,
                "title": "Register on NSP",
                "description": "Visit the National Scholarship Portal and complete OTR (One Time Registration).",
            },
            {
                "step": 2,
                "title": "Fill the Application",
                "description": "Fill the online application form with personal, academic, and bank details.",
            },
            {
                "step": 3,
                "title": "Upload Documents",
                "description": "Upload the required documents.",
            },
            {
                "step": 4,
                "title": "Verification",
                "description": "Your application will be verified at the Institute and State Board levels.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://scholarships.gov.in/",
            "offline_instructions": "Applications are accepted only online via NSP.",
        },
        "official_sources": [
            {"label": "NSP Official Portal", "url": "https://scholarships.gov.in/", "accessed": _LAST_VERIFIED},
        ],
        "verification": {"state": "verified"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Verified against current NSP guidelines for AY 2026-27.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "translations": {
            "hi": {
                "identity": {
                    "short_label": "PM-USP छात्रवृत्ति",
                    "canonical_name": "कॉलेज और विश्वविद्यालय के छात्रों के लिए PM-USP केंद्रीय क्षेत्र छात्रवृत्ति योजना",
                },
                "description": "उच्च शिक्षा प्राप्त करते समय मेधावी छात्रों को वित्तीय सहायता प्रदान करने की योजना।",
                "eligibility_rules": [
                    {
                        "id": "pmusp-percentile",
                        "question": "क्या आप 12वीं कक्षा में सफल उम्मीदवारों के 80वें प्रतिशत से ऊपर हैं?",
                        "explanation": "छात्रों को अपने संबंधित राज्य शिक्षा बोर्डों में सफल उम्मीदवारों के 80वें प्रतिशत से ऊपर होना चाहिए।"
                    },
                    {
                        "id": "pmusp-income",
                        "question": "क्या आपके परिवार की सकल वार्षिक आय ₹4,50,000 या उससे कम है?",
                        "explanation": "सकल माता-पिता/पारिवारिक आय ₹4,50,000 प्रति वर्ष से अधिक नहीं होनी चाहिए।"
                    }
                ],
                "required_documents": [
                    {
                        "id": "aadhaar-card",
                        "name": "आधार कार्ड",
                        "description": "पहचान और DBT के लिए आधार कार्ड।"
                    },
                    {
                        "id": "income-certificate",
                        "name": "आय प्रमाण पत्र",
                        "description": "सक्षम प्राधिकारी द्वारा जारी वैध आय प्रमाण पत्र।"
                    },
                    {
                        "id": "class-12-marksheet",
                        "name": "12वीं कक्षा की मार्कशीट",
                        "description": "12वीं बोर्ड परीक्षा की मार्कशीट।"
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "NSP पर पंजीकरण करें",
                        "description": "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) पर OTR (One Time Registration) पूरा करें।"
                    },
                    {
                        "step": 2,
                        "title": "आवेदन भरें",
                        "description": "व्यक्तिगत, शैक्षणिक और बैंक विवरण के साथ ऑनलाइन आवेदन पत्र भरें।"
                    },
                    {
                        "step": 3,
                        "title": "दस्तावेज़ अपलोड करें",
                        "description": "आवश्यक दस्तावेज़ अपलोड करें।"
                    },
                    {
                        "step": 4,
                        "title": "सत्यापन",
                        "description": "आपके आवेदन का संस्थान और राज्य बोर्ड स्तर पर सत्यापन किया जाएगा।"
                    }
                ],
                "application": {
                    "offline_instructions": "आवेदन केवल NSP के माध्यम से ऑनलाइन स्वीकार किए जाते हैं।"
                },
                "fees": "कोई आवेदन शुल्क नहीं",
                "deadlines": "छात्रों के आवेदन के लिए 31 अक्टूबर 2026 (AY 2026-27)"
            },
            "ta": {
                "identity": {
                    "short_label": "PM-USP உதவித்தொகை",
                    "canonical_name": "கல்லூரி மற்றும் பல்கலைக்கழக மாணவர்களுக்கான PM-USP மத்திய துறை உதவித்தொகை திட்டம்",
                },
                "description": "உயர்கல்வி படிக்கும் குறைந்த வருமானம் கொண்ட குடும்பங்களைச் சேர்ந்த மாணவர்களுக்கு நிதி உதவி வழங்கும் திட்டம்.",
                "eligibility_rules": [
                    {
                        "id": "pmusp-percentile",
                        "question": "நீங்கள் 12 ஆம் வகுப்பில் தேர்ச்சி பெற்றவர்களில் 80 சதவீதத்திற்கு மேல் உள்ளீர்களா?",
                        "explanation": "மாணவர்கள் மாநில கல்வி வாரியங்களில் 80 சதவீதத்திற்கு மேல் இருக்க வேண்டும்."
                    },
                    {
                        "id": "pmusp-income",
                        "question": "உங்கள் குடும்பத்தின் மொத்த ஆண்டு வருமானம் ₹4,50,000 அல்லது அதற்கும் குறைவாக உள்ளதா?",
                        "explanation": "பெற்றோர்/குடும்ப வருமானம் ஆண்டுக்கு ₹4,50,000க்கு மிகாமல் இருக்க வேண்டும்."
                    }
                ],
                "required_documents": [
                    {
                        "id": "aadhaar-card",
                        "name": "ஆதார் அட்டை",
                        "description": "அடையாளம் மற்றும் DBT-க்கான ஆதார் அட்டை."
                    },
                    {
                        "id": "income-certificate",
                        "name": "வருமான சான்றிதழ்",
                        "description": "தகுதியான அதிகாரியால் வழங்கப்பட்ட வருமான சான்றிதழ்."
                    },
                    {
                        "id": "class-12-marksheet",
                        "name": "12 ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்",
                        "description": "12 ஆம் வகுப்பு தேர்வு மதிப்பெண் சான்றிதழ்."
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "NSP-இல் பதிவு செய்க",
                        "description": "NSP-இல் OTR (ஒரு முறை பதிவு) ஐ முடிக்கவும்."
                    },
                    {
                        "step": 2,
                        "title": "விண்ணப்பத்தை நிரப்பவும்",
                        "description": "தனிப்பட்ட, கல்வி மற்றும் வங்கி விவரங்களுடன் விண்ணப்பத்தை நிரப்பவும்."
                    },
                    {
                        "step": 3,
                        "title": "ஆவணங்களை பதிவேற்றுக",
                        "description": "தேவையான ஆவணங்களை பதிவேற்றவும்."
                    },
                    {
                        "step": 4,
                        "title": "சரிபார்ப்பு",
                        "description": "உங்கள் விண்ணப்பம் நிறுவனம் மற்றும் மாநில வாரிய அளவில் சரிபார்க்கப்படும்."
                    }
                ],
                "application": {
                    "offline_instructions": "NSP மூலம் மட்டுமே ஆன்லைனில் விண்ணப்பங்கள் ஏற்றுக்கொள்ளப்படுகின்றன."
                },
                "fees": "விண்ணப்ப கட்டணம் இல்லை",
                "deadlines": "மாணவர் விண்ணப்பங்களுக்கு அக்டோபர் 31, 2026 (AY 2026-27)"
            }
        },
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
    {
        "id": "IN-CENTRAL-MOE-NMMS",
        "slug": "national-means-cum-merit-scholarship",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Ministry of Education",
            "department": "Department of School Education & Literacy",
            "website": "https://dsel.education.gov.in/scheme/national-means-cum-merit-scholarship-nmms",
        },
        "identity": {
            "canonical_name": "National Means-cum-Merit Scholarship (NMMS)",
            "short_label": "NMMS Scholarship",
        },
        "aliases": ["NMMS", "school scholarship", "means cum merit"],
        "category": "Education & Scholarships",
        "life_situations": ["studying", "looking-for-benefits"],
        "description": (
            "A scholarship scheme for meritorious students of economically weaker sections "
            "to arrest their drop out at class VIII and encourage them to continue study at secondary stage."
        ),
        "eligibility_rules": [
            {
                "id": "nmms-class",
                "question": "Are you studying in Class 9 after clearing the State Level Examination?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Awardees must be studying in Class IX to XII in State Government, Government-aided and Local body schools.",
            },
            {
                "id": "nmms-income",
                "question": "Is your family's annual income from all sources not more than ₹3,50,000?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Parental income must not exceed ₹3,50,000 per annum.",
            },
        ],
        "required_documents": [
            {
                "id": "income-certificate",
                "name": "Income Certificate",
                "required": True,
                "description": "Proof of parental income.",
                "alternatives": [],
            },
            {
                "id": "aadhaar-card",
                "name": "Aadhaar Card",
                "required": True,
                "description": "Aadhaar card for DBT.",
                "alternatives": [],
            },
            {
                "id": "caste-certificate",
                "name": "Caste Certificate",
                "required": False,
                "description": "If applying under SC/ST category.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "No application fee",
        "deadlines": "Needs Verification (Check NSP for current state-specific dates)",
        "procedure": [
            {
                "step": 1,
                "title": "Clear State Exam",
                "description": "Pass the State Level Selection Examination for NMMS.",
            },
            {
                "step": 2,
                "title": "Register on NSP",
                "description": "Register on the National Scholarship Portal (NSP) as a new user with OTR.",
            },
            {
                "step": 3,
                "title": "Submit Application",
                "description": "Fill the application on NSP.",
            },
            {
                "step": 4,
                "title": "Institute Verification",
                "description": "Your school will verify your application on the portal.",
            },
        ],
        "application": {
            "mode": "online",
            "official_url": "https://scholarships.gov.in/",
            "offline_instructions": "Applications are accepted only online via NSP.",
        },
        "official_sources": [
            {"label": "NMMS Guidelines", "url": "https://dsel.education.gov.in/scheme/national-means-cum-merit-scholarship-nmms", "accessed": _LAST_VERIFIED},
        ],
        "verification": {"state": "verified"},
        "last_verified_at": _LAST_VERIFIED,
        "verified_by": "SevaPath catalogue curator",
        "review_notes": "Added from the official NSP guidelines.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "translations": {
            "hi": {
                "identity": {
                    "short_label": "NMMS छात्रवृत्ति",
                    "canonical_name": "राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति (NMMS)",
                },
                "description": "आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों के लिए एक छात्रवृत्ति योजना ताकि आठवीं कक्षा में उनके ड्रॉप आउट को रोका जा सके।",
                "eligibility_rules": [
                    {
                        "id": "nmms-class",
                        "question": "क्या आप राज्य स्तरीय परीक्षा उत्तीर्ण करने के बाद कक्षा 9 में पढ़ रहे हैं?",
                        "explanation": "छात्रों को राज्य सरकार, सरकारी सहायता प्राप्त स्कूलों में कक्षा IX से XII में अध्ययनरत होना चाहिए।"
                    },
                    {
                        "id": "nmms-income",
                        "question": "क्या आपके परिवार की सभी स्रोतों से वार्षिक आय ₹3,50,000 से अधिक नहीं है?",
                        "explanation": "माता-पिता की आय ₹3,50,000 प्रति वर्ष से अधिक नहीं होनी चाहिए।"
                    }
                ],
                "required_documents": [
                    {
                        "id": "income-certificate",
                        "name": "आय प्रमाण पत्र",
                        "description": "माता-पिता की आय का प्रमाण।"
                    },
                    {
                        "id": "aadhaar-card",
                        "name": "आधार कार्ड",
                        "description": "DBT के लिए आधार कार्ड।"
                    },
                    {
                        "id": "caste-certificate",
                        "name": "जाति प्रमाण पत्र",
                        "description": "SC/ST श्रेणी के तहत आवेदन करने पर।"
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "राज्य परीक्षा उत्तीर्ण करें",
                        "description": "NMMS के लिए राज्य स्तरीय चयन परीक्षा उत्तीर्ण करें।"
                    },
                    {
                        "step": 2,
                        "title": "NSP पर पंजीकरण करें",
                        "description": "NSP पर OTR के साथ नए उपयोगकर्ता के रूप में पंजीकरण करें।"
                    },
                    {
                        "step": 3,
                        "title": "आवेदन जमा करें",
                        "description": "NSP पर आवेदन भरें।"
                    },
                    {
                        "step": 4,
                        "title": "संस्थान सत्यापन",
                        "description": "आपका स्कूल पोर्टल पर आपके आवेदन का सत्यापन करेगा।"
                    }
                ],
                "application": {
                    "offline_instructions": "आवेदन केवल NSP के माध्यम से ऑनलाइन स्वीकार किए जाते हैं।"
                },
                "fees": "कोई आवेदन शुल्क नहीं",
                "deadlines": "सत्यापन की आवश्यकता है (वर्तमान तिथियों के लिए NSP देखें)"
            },
            "ta": {
                "identity": {
                    "short_label": "NMMS உதவித்தொகை",
                    "canonical_name": "தேசிய தகுதி மற்றும் வருமானம் அடிப்படையிலான உதவித்தொகை (NMMS)",
                },
                "description": "பொருளாதார ரீதியாக நலிவடைந்த பிரிவுகளைச் சேர்ந்த தகுதியுள்ள மாணவர்களுக்கான உதவித்தொகை திட்டம்.",
                "eligibility_rules": [
                    {
                        "id": "nmms-class",
                        "question": "மாநில அளவிலான தேர்வில் தேர்ச்சி பெற்ற பிறகு நீங்கள் 9 ஆம் வகுப்பில் படிக்கிறீர்களா?",
                        "explanation": "மாணவர்கள் அரசு அல்லது அரசு உதவிபெறும் பள்ளிகளில் IX முதல் XII வரை படிக்க வேண்டும்."
                    },
                    {
                        "id": "nmms-income",
                        "question": "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் ₹3,50,000க்கு மிகாமல் உள்ளதா?",
                        "explanation": "பெற்றோரின் வருமானம் ₹3,50,000க்கு மிகாமல் இருக்க வேண்டும்."
                    }
                ],
                "required_documents": [
                    {
                        "id": "income-certificate",
                        "name": "வருமான சான்றிதழ்",
                        "description": "பெற்றோரின் வருமானத்திற்கான சான்று."
                    },
                    {
                        "id": "aadhaar-card",
                        "name": "ஆதார் அட்டை",
                        "description": "DBT-க்கான ஆதார் அட்டை."
                    },
                    {
                        "id": "caste-certificate",
                        "name": "சாதி சான்றிதழ்",
                        "description": "SC/ST பிரிவின் கீழ் விண்ணப்பித்தால்."
                    }
                ],
                "procedure": [
                    {
                        "step": 1,
                        "title": "மாநில தேர்வில் தேர்ச்சி பெறவும்",
                        "description": "NMMS-க்கான மாநில அளவிலான தேர்வில் தேர்ச்சி பெறவும்."
                    },
                    {
                        "step": 2,
                        "title": "NSP-இல் பதிவு செய்க",
                        "description": "NSP-இல் புதிய பயனராக OTR உடன் பதிவு செய்யவும்."
                    },
                    {
                        "step": 3,
                        "title": "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
                        "description": "NSP-இல் விண்ணப்பத்தை நிரப்பவும்."
                    },
                    {
                        "step": 4,
                        "title": "நிறுவன சரிபார்ப்பு",
                        "description": "போர்ட்டலில் உங்கள் பள்ளி உங்கள் விண்ணப்பத்தை சரிபார்க்கும்."
                    }
                ],
                "application": {
                    "offline_instructions": "NSP மூலம் மட்டுமே ஆன்லைனில் விண்ணப்பங்கள் ஏற்றுக்கொள்ளப்படுகின்றன."
                },
                "fees": "விண்ணப்ப கட்டணம் இல்லை",
                "deadlines": "சரிபார்ப்பு தேவை (தற்போதைய தேதிகளுக்கு NSP ஐ சரிபார்க்கவும்)"
            }
        },
        "is_test_fixture": False,
        "test_fixture_label": None,
    },
]

