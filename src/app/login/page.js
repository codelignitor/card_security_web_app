"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select";

export default function LoginPage() {
  const router = useRouter();
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loginData, setLoginData] = useState(null);
  const [formData, setFormData] = useState({
    countryCode: "+1", // Default country code
  });


  // Comprehensive list of countries with codes, names, and flags
  const countryCodes = [
    { code: "+93", country: "Afghanistan", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+355", country: "Albania", name: "Albania", flag: "🇦🇱" },
    { code: "+213", country: "Algeria", name: "Algeria", flag: "🇩🇿" },
    {
      code: "+1684",
      country: "American Samoa",
      name: "American Samoa",
      flag: "🇦🇸",
    },
    { code: "+376", country: "Andorra", name: "Andorra", flag: "🇦🇩" },
    { code: "+244", country: "Angola", name: "Angola", flag: "🇦🇴" },
    { code: "+1264", country: "Anguilla", name: "Anguilla", flag: "🇦🇮" },
    {
      code: "+1268",
      country: "Antigua and Barbuda",
      name: "Antigua and Barbuda",
      flag: "🇦🇬",
    },
    { code: "+54", country: "Argentina", name: "Argentina", flag: "🇦🇷" },
    { code: "+374", country: "Armenia", name: "Armenia", flag: "🇦🇲" },
    { code: "+297", country: "Aruba", name: "Aruba", flag: "🇦🇼" },
    { code: "+61", country: "Australia", name: "Australia", flag: "🇦🇺" },
    { code: "+43", country: "Austria", name: "Austria", flag: "🇦🇹" },
    { code: "+994", country: "Azerbaijan", name: "Azerbaijan", flag: "🇦🇿" },
    { code: "+1242", country: "Bahamas", name: "Bahamas", flag: "🇧🇸" },
    { code: "+973", country: "Bahrain", name: "Bahrain", flag: "🇧🇭" },
    { code: "+880", country: "Bangladesh", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+1246", country: "Barbados", name: "Barbados", flag: "🇧🇧" },
    { code: "+375", country: "Belarus", name: "Belarus", flag: "🇧🇾" },
    { code: "+32", country: "Belgium", name: "Belgium", flag: "🇧🇪" },
    { code: "+501", country: "Belize", name: "Belize", flag: "🇧🇿" },
    { code: "+229", country: "Benin", name: "Benin", flag: "🇧🇯" },
    { code: "+1441", country: "Bermuda", name: "Bermuda", flag: "🇧🇲" },
    { code: "+975", country: "Bhutan", name: "Bhutan", flag: "🇧🇹" },
    { code: "+591", country: "Bolivia", name: "Bolivia", flag: "🇧🇴" },
    {
      code: "+387",
      country: "Bosnia and Herzegovina",
      name: "Bosnia and Herzegovina",
      flag: "🇧🇦",
    },
    { code: "+267", country: "Botswana", name: "Botswana", flag: "🇧🇼" },
    { code: "+55", country: "Brazil", name: "Brazil", flag: "🇧🇷" },
    {
      code: "+1284",
      country: "British Virgin Islands",
      name: "British Virgin Islands",
      flag: "🇻🇬",
    },
    { code: "+673", country: "Brunei", name: "Brunei", flag: "🇧🇳" },
    { code: "+359", country: "Bulgaria", name: "Bulgaria", flag: "🇧🇬" },
    { code: "+226", country: "Burkina Faso", name: "Burkina Faso", flag: "🇧🇫" },
    { code: "+257", country: "Burundi", name: "Burundi", flag: "🇧🇮" },
    { code: "+855", country: "Cambodia", name: "Cambodia", flag: "🇰🇭" },
    { code: "+237", country: "Cameroon", name: "Cameroon", flag: "🇨🇲" },
    { code: "+1", country: "Canada", name: "Canada", flag: "🇨🇦" },
    { code: "+238", country: "Cape Verde", name: "Cape Verde", flag: "🇨🇻" },
    {
      code: "+1345",
      country: "Cayman Islands",
      name: "Cayman Islands",
      flag: "🇰🇾",
    },
    {
      code: "+236",
      country: "Central African Republic",
      name: "Central African Republic",
      flag: "🇨🇫",
    },
    { code: "+235", country: "Chad", name: "Chad", flag: "🇹🇩" },
    { code: "+56", country: "Chile", name: "Chile", flag: "🇨🇱" },
    { code: "+86", country: "China", name: "China", flag: "🇨🇳" },
    { code: "+57", country: "Colombia", name: "Colombia", flag: "🇨🇴" },
    { code: "+269", country: "Comoros", name: "Comoros", flag: "🇰🇲" },
    { code: "+242", country: "Congo", name: "Congo", flag: "🇨🇬" },
    {
      code: "+243",
      country: "Democratic Republic of the Congo",
      name: "DR Congo",
      flag: "🇨🇩",
    },
    { code: "+682", country: "Cook Islands", name: "Cook Islands", flag: "🇨🇰" },
    { code: "+506", country: "Costa Rica", name: "Costa Rica", flag: "🇨🇷" },
    {
      code: "+225",
      country: "Côte d'Ivoire",
      name: "Côte d'Ivoire",
      flag: "🇨🇮",
    },
    { code: "+385", country: "Croatia", name: "Croatia", flag: "🇭🇷" },
    { code: "+53", country: "Cuba", name: "Cuba", flag: "🇨🇺" },
    { code: "+357", country: "Cyprus", name: "Cyprus", flag: "🇨🇾" },
    {
      code: "+420",
      country: "Czech Republic",
      name: "Czech Republic",
      flag: "🇨🇿",
    },
    { code: "+45", country: "Denmark", name: "Denmark", flag: "🇩🇰" },
    { code: "+253", country: "Djibouti", name: "Djibouti", flag: "🇩🇯" },
    { code: "+1767", country: "Dominica", name: "Dominica", flag: "🇩🇲" },
    {
      code: "+1809",
      country: "Dominican Republic",
      name: "Dominican Republic",
      flag: "🇩🇴",
    },
    { code: "+593", country: "Ecuador", name: "Ecuador", flag: "🇪🇨" },
    { code: "+20", country: "Egypt", name: "Egypt", flag: "🇪🇬" },
    { code: "+503", country: "El Salvador", name: "El Salvador", flag: "🇸🇻" },
    {
      code: "+240",
      country: "Equatorial Guinea",
      name: "Equatorial Guinea",
      flag: "🇬🇶",
    },
    { code: "+291", country: "Eritrea", name: "Eritrea", flag: "🇪🇷" },
    { code: "+372", country: "Estonia", name: "Estonia", flag: "🇪🇪" },
    { code: "+251", country: "Ethiopia", name: "Ethiopia", flag: "🇪🇹" },
    {
      code: "+500",
      country: "Falkland Islands",
      name: "Falkland Islands",
      flag: "🇫🇰",
    },
    {
      code: "+298",
      country: "Faroe Islands",
      name: "Faroe Islands",
      flag: "🇫🇴",
    },
    { code: "+679", country: "Fiji", name: "Fiji", flag: "🇫🇯" },
    { code: "+358", country: "Finland", name: "Finland", flag: "🇫🇮" },
    { code: "+33", country: "France", name: "France", flag: "🇫🇷" },
    {
      code: "+594",
      country: "French Guiana",
      name: "French Guiana",
      flag: "🇬🇫",
    },
    {
      code: "+689",
      country: "French Polynesia",
      name: "French Polynesia",
      flag: "🇵🇫",
    },
    { code: "+241", country: "Gabon", name: "Gabon", flag: "🇬🇦" },
    { code: "+220", country: "Gambia", name: "Gambia", flag: "🇬🇲" },
    { code: "+995", country: "Georgia", name: "Georgia", flag: "🇬🇪" },
    { code: "+49", country: "Germany", name: "Germany", flag: "🇩🇪" },
    { code: "+233", country: "Ghana", name: "Ghana", flag: "🇬🇭" },
    { code: "+350", country: "Gibraltar", name: "Gibraltar", flag: "🇬🇮" },
    { code: "+30", country: "Greece", name: "Greece", flag: "🇬🇷" },
    { code: "+299", country: "Greenland", name: "Greenland", flag: "🇬🇱" },
    { code: "+1473", country: "Grenada", name: "Grenada", flag: "🇬🇩" },
    { code: "+590", country: "Guadeloupe", name: "Guadeloupe", flag: "🇬🇵" },
    { code: "+1671", country: "Guam", name: "Guam", flag: "🇬🇺" },
    { code: "+502", country: "Guatemala", name: "Guatemala", flag: "🇬🇹" },
    { code: "+224", country: "Guinea", name: "Guinea", flag: "🇬🇳" },
    {
      code: "+245",
      country: "Guinea-Bissau",
      name: "Guinea-Bissau",
      flag: "🇬🇼",
    },
    { code: "+592", country: "Guyana", name: "Guyana", flag: "🇬🇾" },
    { code: "+509", country: "Haiti", name: "Haiti", flag: "🇭🇹" },
    { code: "+504", country: "Honduras", name: "Honduras", flag: "🇭🇳" },
    { code: "+852", country: "Hong Kong", name: "Hong Kong", flag: "🇭🇰" },
    { code: "+36", country: "Hungary", name: "Hungary", flag: "🇭🇺" },
    { code: "+354", country: "Iceland", name: "Iceland", flag: "🇮🇸" },
    { code: "+91", country: "India", name: "India", flag: "🇮🇳" },
    { code: "+62", country: "Indonesia", name: "Indonesia", flag: "🇮🇩" },
    { code: "+98", country: "Iran", name: "Iran", flag: "🇮🇷" },
    { code: "+964", country: "Iraq", name: "Iraq", flag: "🇮🇶" },
    { code: "+353", country: "Ireland", name: "Ireland", flag: "🇮🇪" },
    { code: "+972", country: "Israel", name: "Israel", flag: "🇮🇱" },
    { code: "+39", country: "Italy", name: "Italy", flag: "🇮🇹" },
    { code: "+1876", country: "Jamaica", name: "Jamaica", flag: "🇯🇲" },
    { code: "+81", country: "Japan", name: "Japan", flag: "🇯🇵" },
    { code: "+962", country: "Jordan", name: "Jordan", flag: "🇯🇴" },
    { code: "+7", country: "Kazakhstan", name: "Kazakhstan", flag: "🇰🇿" },
    { code: "+254", country: "Kenya", name: "Kenya", flag: "🇰🇪" },
    { code: "+686", country: "Kiribati", name: "Kiribati", flag: "🇰🇮" },
    { code: "+850", country: "North Korea", name: "North Korea", flag: "🇰🇵" },
    { code: "+82", country: "South Korea", name: "South Korea", flag: "🇰🇷" },
    { code: "+965", country: "Kuwait", name: "Kuwait", flag: "🇰🇼" },
    { code: "+996", country: "Kyrgyzstan", name: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+856", country: "Laos", name: "Laos", flag: "🇱🇦" },
    { code: "+371", country: "Latvia", name: "Latvia", flag: "🇱🇻" },
    { code: "+961", country: "Lebanon", name: "Lebanon", flag: "🇱🇧" },
    { code: "+266", country: "Lesotho", name: "Lesotho", flag: "🇱🇸" },
    { code: "+231", country: "Liberia", name: "Liberia", flag: "🇱🇷" },
    { code: "+218", country: "Libya", name: "Libya", flag: "🇱🇾" },
    {
      code: "+423",
      country: "Liechtenstein",
      name: "Liechtenstein",
      flag: "🇱🇮",
    },
    { code: "+370", country: "Lithuania", name: "Lithuania", flag: "🇱🇹" },
    { code: "+352", country: "Luxembourg", name: "Luxembourg", flag: "🇱🇺" },
    { code: "+853", country: "Macau", name: "Macau", flag: "🇲🇴" },
    { code: "+389", country: "Macedonia", name: "Macedonia", flag: "🇲🇰" },
    { code: "+261", country: "Madagascar", name: "Madagascar", flag: "🇲🇬" },
    { code: "+265", country: "Malawi", name: "Malawi", flag: "🇲🇼" },
    { code: "+60", country: "Malaysia", name: "Malaysia", flag: "🇲🇾" },
    { code: "+960", country: "Maldives", name: "Maldives", flag: "🇲🇻" },
    { code: "+223", country: "Mali", name: "Mali", flag: "🇲🇱" },
    { code: "+356", country: "Malta", name: "Malta", flag: "🇲🇹" },
    {
      code: "+692",
      country: "Marshall Islands",
      name: "Marshall Islands",
      flag: "🇲🇭",
    },
    { code: "+596", country: "Martinique", name: "Martinique", flag: "🇲🇶" },
    { code: "+222", country: "Mauritania", name: "Mauritania", flag: "🇲🇷" },
    { code: "+230", country: "Mauritius", name: "Mauritius", flag: "🇲🇺" },
    { code: "+52", country: "Mexico", name: "Mexico", flag: "🇲🇽" },
    { code: "+691", country: "Micronesia", name: "Micronesia", flag: "🇫🇲" },
    { code: "+373", country: "Moldova", name: "Moldova", flag: "🇲🇩" },
    { code: "+377", country: "Monaco", name: "Monaco", flag: "🇲🇨" },
    { code: "+976", country: "Mongolia", name: "Mongolia", flag: "🇲🇳" },
    { code: "+382", country: "Montenegro", name: "Montenegro", flag: "🇲🇪" },
    { code: "+1664", country: "Montserrat", name: "Montserrat", flag: "🇲🇸" },
    { code: "+212", country: "Morocco", name: "Morocco", flag: "🇲🇦" },
    { code: "+258", country: "Mozambique", name: "Mozambique", flag: "🇲🇿" },
    { code: "+95", country: "Myanmar", name: "Myanmar", flag: "🇲🇲" },
    { code: "+264", country: "Namibia", name: "Namibia", flag: "🇳🇦" },
    { code: "+674", country: "Nauru", name: "Nauru", flag: "🇳🇷" },
    { code: "+977", country: "Nepal", name: "Nepal", flag: "🇳🇵" },
    { code: "+31", country: "Netherlands", name: "Netherlands", flag: "🇳🇱" },
    {
      code: "+687",
      country: "New Caledonia",
      name: "New Caledonia",
      flag: "🇳🇨",
    },
    { code: "+64", country: "New Zealand", name: "New Zealand", flag: "🇳🇿" },
    { code: "+505", country: "Nicaragua", name: "Nicaragua", flag: "🇳🇮" },
    { code: "+227", country: "Niger", name: "Niger", flag: "🇳🇪" },
    { code: "+234", country: "Nigeria", name: "Nigeria", flag: "🇳🇬" },
    { code: "+683", country: "Niue", name: "Niue", flag: "🇳🇺" },
    {
      code: "+672",
      country: "Norfolk Island",
      name: "Norfolk Island",
      flag: "🇳🇫",
    },
    {
      code: "+1670",
      country: "Northern Mariana Islands",
      name: "Northern Mariana Islands",
      flag: "🇲🇵",
    },
    { code: "+47", country: "Norway", name: "Norway", flag: "🇳🇴" },
    { code: "+968", country: "Oman", name: "Oman", flag: "🇴🇲" },
    { code: "+92", country: "Pakistan", name: "Pakistan", flag: "🇵🇰" },
    { code: "+680", country: "Palau", name: "Palau", flag: "🇵🇼" },
    { code: "+970", country: "Palestine", name: "Palestine", flag: "🇵🇸" },
    { code: "+507", country: "Panama", name: "Panama", flag: "🇵🇦" },
    {
      code: "+675",
      country: "Papua New Guinea",
      name: "Papua New Guinea",
      flag: "🇵🇬",
    },
    { code: "+595", country: "Paraguay", name: "Paraguay", flag: "🇵🇾" },
    { code: "+51", country: "Peru", name: "Peru", flag: "🇵🇪" },
    { code: "+63", country: "Philippines", name: "Philippines", flag: "🇵🇭" },
    { code: "+48", country: "Poland", name: "Poland", flag: "🇵🇱" },
    { code: "+351", country: "Portugal", name: "Portugal", flag: "🇵🇹" },
    { code: "+1787", country: "Puerto Rico", name: "Puerto Rico", flag: "🇵🇷" },
    { code: "+974", country: "Qatar", name: "Qatar", flag: "🇶🇦" },
    { code: "+262", country: "Réunion", name: "Réunion", flag: "🇷🇪" },
    { code: "+40", country: "Romania", name: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "Russia", name: "Russia", flag: "🇷🇺" },
    { code: "+250", country: "Rwanda", name: "Rwanda", flag: "🇷🇼" },
    { code: "+290", country: "Saint Helena", name: "Saint Helena", flag: "🇸🇭" },
    {
      code: "+1869",
      country: "Saint Kitts and Nevis",
      name: "Saint Kitts and Nevis",
      flag: "🇰🇳",
    },
    { code: "+1758", country: "Saint Lucia", name: "Saint Lucia", flag: "🇱🇨" },
    {
      code: "+508",
      country: "Saint Pierre and Miquelon",
      name: "Saint Pierre and Miquelon",
      flag: "🇵🇲",
    },
    {
      code: "+1784",
      country: "Saint Vincent and the Grenadines",
      name: "Saint Vincent and the Grenadines",
      flag: "🇻🇨",
    },
    { code: "+685", country: "Samoa", name: "Samoa", flag: "🇼🇸" },
    { code: "+378", country: "San Marino", name: "San Marino", flag: "🇸🇲" },
    {
      code: "+239",
      country: "São Tomé and Príncipe",
      name: "São Tomé and Príncipe",
      flag: "🇸🇹",
    },
    { code: "+966", country: "Saudi Arabia", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+221", country: "Senegal", name: "Senegal", flag: "🇸🇳" },
    { code: "+381", country: "Serbia", name: "Serbia", flag: "🇷🇸" },
    { code: "+248", country: "Seychelles", name: "Seychelles", flag: "🇸🇨" },
    { code: "+232", country: "Sierra Leone", name: "Sierra Leone", flag: "🇸🇱" },
    { code: "+65", country: "Singapore", name: "Singapore", flag: "🇸🇬" },
    { code: "+421", country: "Slovakia", name: "Slovakia", flag: "🇸🇰" },
    { code: "+386", country: "Slovenia", name: "Slovenia", flag: "🇸🇮" },
    {
      code: "+677",
      country: "Solomon Islands",
      name: "Solomon Islands",
      flag: "🇸🇧",
    },
    { code: "+252", country: "Somalia", name: "Somalia", flag: "🇸🇴" },
    { code: "+27", country: "South Africa", name: "South Africa", flag: "🇿🇦" },
    { code: "+34", country: "Spain", name: "Spain", flag: "🇪🇸" },
    { code: "+94", country: "Sri Lanka", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+249", country: "Sudan", name: "Sudan", flag: "🇸🇩" },
    { code: "+597", country: "Suriname", name: "Suriname", flag: "🇸🇷" },
    { code: "+268", country: "Swaziland", name: "Swaziland", flag: "🇸🇿" },
    { code: "+46", country: "Sweden", name: "Sweden", flag: "🇸🇪" },
    { code: "+41", country: "Switzerland", name: "Switzerland", flag: "🇨🇭" },
    { code: "+963", country: "Syria", name: "Syria", flag: "🇸🇾" },
    { code: "+886", country: "Taiwan", name: "Taiwan", flag: "🇹🇼" },
    { code: "+992", country: "Tajikistan", name: "Tajikistan", flag: "🇹🇯" },
    { code: "+255", country: "Tanzania", name: "Tanzania", flag: "🇹🇿" },
    { code: "+66", country: "Thailand", name: "Thailand", flag: "🇹🇭" },
    { code: "+670", country: "Timor-Leste", name: "Timor-Leste", flag: "🇹🇱" },
    { code: "+228", country: "Togo", name: "Togo", flag: "🇹🇬" },
    { code: "+690", country: "Tokelau", name: "Tokelau", flag: "🇹🇰" },
    { code: "+676", country: "Tonga", name: "Tonga", flag: "🇹🇴" },
    {
      code: "+1868",
      country: "Trinidad and Tobago",
      name: "Trinidad and Tobago",
      flag: "🇹🇹",
    },
    { code: "+216", country: "Tunisia", name: "Tunisia", flag: "🇹🇳" },
    { code: "+90", country: "Turkey", name: "Turkey", flag: "🇹🇷" },
    { code: "+993", country: "Turkmenistan", name: "Turkmenistan", flag: "🇹🇲" },
    {
      code: "+1649",
      country: "Turks and Caicos Islands",
      name: "Turks and Caicos Islands",
      flag: "🇹🇨",
    },
    { code: "+688", country: "Tuvalu", name: "Tuvalu", flag: "🇹🇻" },
    { code: "+256", country: "Uganda", name: "Uganda", flag: "🇺🇬" },
    { code: "+380", country: "Ukraine", name: "Ukraine", flag: "🇺🇦" },
    {
      code: "+971",
      country: "United Arab Emirates",
      name: "United Arab Emirates",
      flag: "🇦🇪",
    },
    {
      code: "+44",
      country: "United Kingdom",
      name: "United Kingdom",
      flag: "🇬🇧",
    },
    { code: "+1", country: "United States", name: "United States", flag: "🇺🇸" },
    { code: "+598", country: "Uruguay", name: "Uruguay", flag: "🇺🇾" },
    { code: "+998", country: "Uzbekistan", name: "Uzbekistan", flag: "🇺🇿" },
    { code: "+678", country: "Vanuatu", name: "Vanuatu", flag: "🇻🇺" },
    { code: "+379", country: "Vatican City", name: "Vatican City", flag: "🇻🇦" },
    { code: "+58", country: "Venezuela", name: "Venezuela", flag: "🇻🇪" },
    { code: "+84", country: "Vietnam", name: "Vietnam", flag: "🇻🇳" },
    {
      code: "+1340",
      country: "US Virgin Islands",
      name: "US Virgin Islands",
      flag: "🇻🇮",
    },
    {
      code: "+681",
      country: "Wallis and Futuna",
      name: "Wallis and Futuna",
      flag: "🇼🇫",
    },
    { code: "+967", country: "Yemen", name: "Yemen", flag: "🇾🇪" },
    { code: "+260", country: "Zambia", name: "Zambia", flag: "🇿🇲" },
    { code: "+263", country: "Zimbabwe", name: "Zimbabwe", flag: "🇿🇼" },
  ];


   const options = countryCodes.map((country) => ({
  value: `${country.code}-${country.name}`,
  label: `${country.flag} ${country.name} (${country.code})`,
}));

  // Check if we're on the client side
  const isClient = typeof window !== "undefined";


 const handleChange = (selectedOption) => {
    const [code, name] = selectedOption.value.split("-");
    setFormData((prev) => ({
      ...prev,
      countryCode: code,
      selectedCountry: name,
    }));
  };


  // Updated country selector handler
  const handleCountryCodeChange = (e) => {
    const selectedValue = e.target.value;
    const selectedCountryObj = countryCodes.find(
      (country) => `${country.code}-${country.name}` === selectedValue
    );

    if (selectedCountryObj) {
      setFormData((prev) => ({
        ...prev,
        countryCode: selectedCountryObj.code,
        selectedCountry: selectedCountryObj.name,
      }));
    }
    // Clear error when user changes selection
    if (error) setError("");
  };

  // Get selected country info for display
  const getSelectedCountryInfo = () => {
    const selected = countryCodes.find(
      (country) =>
        country.code === formData.countryCode &&
        country.name === formData.selectedCountry
    );
    return (
      selected ||
      countryCodes.find((country) => country.name === "United States")
    );
  };

  const handleEmailOrPhoneChange = (e) => {
    const newValue = e.target.value;
    setEmailOrPhone(newValue);

    // Clear error when user starts typing
    if (error) setError("");

    // Save email/phone if remember me is checked
    if (rememberMe && isClient) {
      try {
        localStorage.setItem("savedEmail", newValue);
      } catch (error) {
        console.error("Error saving email:", error);
      }
    }
  };

  const setStoredAuth = (token, user, remember) => {
    if (isClient) {
      try {
        if (remember) {
          // Store in localStorage for persistence
          localStorage.setItem("authToken", token);
          localStorage.setItem("userData", JSON.stringify(user));
        } else {
          // Store in sessionStorage for session only
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!isOtpMode) {
      // First step: Send login request to get OTP
      setLoading(true);
      setError("");

      try {
        const requestBody = {
          country_code: formData.countryCode,
          login_input: emailOrPhone,
        };

        console.log(
          "Sending request body:",
          JSON.stringify(requestBody, null, 2)
        );

        const response = await fetch(
          "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && data.status) {
          // Success - OTP sent, show OTP form
          setLoginData(data);
          setIsOtpMode(true);
          console.log("Login verification code sent:", data);

          // Save credentials if remember me is checked
          if (rememberMe && isClient) {
            try {
              localStorage.setItem("savedEmail", emailOrPhone);
              localStorage.setItem("savedCountryCode", formData.countryCode);
              localStorage.setItem("rememberLogin", "true");
            } catch (error) {
              console.error("Error saving credentials:", error);
            }
          }
        } else {
          // Handle API errors
          console.error("API Error:", data);
          setError(
            data.message ||
              `Login failed (${response.status}). Please check your credentials.`
          );
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Second step: Verify OTP
      handleOtpVerification();
    }
  };

  const handleBack = () => {
    setIsOtpMode(false);
    setOtp("");
    setOtpError("");
    setLoginData(null);
  };

  const handleResendOtp = async () => {
    // Check for loginData instead of userInfo
    if (!loginData) return;

    setLoading(true);
    setOtpError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            country_code: formData.countryCode,
            email: loginData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        setSuccess("Verification code resent successfully!");
        console.log("Resend otp", data);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setOtpError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    // Clear error when user starts typing
    if (otpError) setOtpError("");
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    setOtpError("");

    try {
      const requestBody = {
        email: loginData.email,
        otp: otp,
      };

      const response = await fetch(
        "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        console.log("Login successful:", data);

        // ✅ Save user data including role
        const userData = {
          token: data.token,
          user: data.user,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        // ✅ Role-based redirection
        const userRole = data.user?.role;

        if (userRole === "superadmin") {
          router.push("/admin");
        } else if (userRole === "BUSINESS_USER") {
          router.push("/dashboard");
        } else {
          // Default to admin for any other role or missing role
          router.push("/admin");
        }
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-[60%] object-fill"
        >
          <source src="https://d3rfyed8zhcsm.cloudfront.net/Header2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-25">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl my-2 font-bold text-white drop-shadow-lg"
              >
                <video autoPlay loop muted playsInline width="70">
<source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20Video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Main Card */}
          <div className="rounded-xl text-black bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl p-6 sm:p-8 transition-all duration-300 ease-in-out transform">
            <form onSubmit={handleSignIn}>
              {!isOtpMode ? (
                // Login Form
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-6 sm:mb-8">
                    Sign in to your account
                  </h2>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {/* Country Selector */}
                    <div>
                      <label
                        htmlFor="countryCode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Select your country
                      </label>
{/* 
                      <select
                        id="countryCode"
                        name="countryCode"
                        value={`${formData.countryCode}-${formData.selectedCountry}`}
                        onChange={handleCountryCodeChange}
                        disabled={loading}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 disabled:bg-gray-100 text-sm sm:text-base"
                      >
                        <option value="">Select your country</option>
                        {countryCodes.map((country, index) => (
                          <option
                            key={index}
                            value={`${country.code}-${country.name}`}
                          >
                            {country.flag} {country.name} ({country.code})
                          </option>
                        ))}
                      </select> */}


                    <Select
      id="countryCode"
      name="countryCode"
      value={options.find(
        (opt) =>
          opt.value ===
          `${formData.countryCode}-${formData.selectedCountry}`
      )}
      onChange={handleChange}
      isDisabled={loading}
      options={options}
      placeholder="Select your country"
      className="text-sm sm:text-base"
      classNamePrefix="react-select"
    />

                    </div>

                    {/* Email/Phone Input */}
                    <div>
                      <label
                        htmlFor="emailOrPhone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email or Phone
                      </label>
                      <div className="flex">
                        <div className="flex-shrink-0 flex items-center px-3 py-3 border border-gray-300 border-r-0 rounded-l-md shadow-sm bg-gray-50 text-sm text-gray-600">
                          {getSelectedCountryInfo().flag}{" "}
                          {formData.countryCode || "+1"}
                        </div>

                        <input
                          id="emailOrPhone"
                          type="text"
                          value={emailOrPhone}
                          onChange={handleEmailOrPhoneChange}
                          disabled={loading}
                          className="flex-1 min-w-0 px-3 py-3 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 disabled:bg-gray-100 text-sm sm:text-base"
                          placeholder="Enter your email or phone number"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        loading || !emailOrPhone.trim() || !formData.countryCode
                      }
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Sending OTP..." : "Sign in"}
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        New to our App?{" "}
                        <Link
                          href="/signup"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Create account
                        </Link>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // OTP Form
                <>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className="flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium disabled:text-gray-400"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                    Enter verification code
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 sm:mb-8 break-words">
                    We sent a code to {getSelectedCountryInfo().flag}{" "}
                    {formData.countryCode} {emailOrPhone}
                  </p>

                  {/* OTP Error Message */}
                  {otpError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {otpError}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={loading}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg sm:text-xl tracking-widest bg-white/90 disabled:bg-gray-100"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                      >
                        {loading ? "Sending..." : "Resend code"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-transparent py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center space-x-4 text-sm text-black/90 drop-shadow-lg">
              <span>© CardNest</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Privacy & terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
