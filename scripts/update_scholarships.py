import json
import ast

def update_verified():
    with open("backend/services/verified.py", "r", encoding="utf-8") as f:
        content = f.read()
    
    # We will replace everything from the start of PM YASASVI to the end
    split_marker = '    {\n        "id": "IN-CENTRAL-MSJE-PMYASASVI",'
    if split_marker not in content:
        print("Could not find split marker")
        return
        
    base_content = content.split(split_marker)[0]
    
    new_scholarships = """    {
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
                    "short_label": "पीएम यशस्वी (प्री-मैट्रिक)",
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
                        "name": "சான்றிதழ்",
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
"""

    new_content = base_content + new_scholarships
    with open("backend/services/verified.py", "w", encoding="utf-8") as f:
        f.write(new_content)

if __name__ == "__main__":
    update_verified()
