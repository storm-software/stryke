/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * A running list of common acronyms and their meanings.
 *
 * @remarks
 * This list is not exhaustive and may be updated over time.
 */
export const ACRONYMS: Record<
  string,
  { description: string; display?: string }
> = {
  "2D": { description: "Two-Dimensional", display: "2d" },
  "3D": { description: "Three-Dimensional", display: "3d" },
  "4D": { description: "Four-Dimensional", display: "4d" },
  "5G": { description: "Fifth Generation (mobile networks)" },
  "6G": { description: "Sixth Generation (mobile networks)" },
  "7G": { description: "Seventh Generation (mobile networks)" },
  "8G": { description: "Eighth Generation (mobile networks)" },
  "ACID": { description: "Atomicity, Consistency, Isolation, Durability" },
  "AITA": { description: "Am I The Asshole" },
  "AES": { description: "Advanced Encryption Standard" },
  "AI": { description: "Artificial Intelligence" },
  "AJAX": { description: "Asynchronous JavaScript and XML" },
  "API": { description: "Application Programming Interface" },
  "AR": { description: "Augmented Reality" },
  "ASCII": {
    description: "American Standard Code for Information Interchange"
  },
  "ATF": { description: "Bureau of Alcohol, Tobacco, Firearms and Explosives" },
  "ATM": { description: "Automated Teller Machine" },
  "B2B": { description: "Business to Business" },
  "B2C": { description: "Business to Consumer" },
  "BATFE": {
    description: "Bureau of Alcohol, Tobacco, Firearms and Explosives"
  },
  "BFF": { description: "Best Friends Forever" },
  "BFFS": { description: "Best Friends Forever (plural)" },
  "BI": { description: "Business Intelligence" },
  "BIOS": { description: "Basic Input/Output System" },
  "BGP": { description: "Border Gateway Protocol" },
  "BOM": { description: "Bill of Materials / Byte Order Mark" },
  "BYOD": { description: "Bring Your Own Device" },
  "C2C": { description: "Consumer to Consumer" },
  "CAGR": { description: "Compound Annual Growth Rate" },
  "CAPTCHA": {
    description:
      "Completely Automated Public Turing test to tell Computers and Humans Apart"
  },
  "CD": { description: "Continuous Delivery / Compact Disc" },
  "CDN": { description: "Content Delivery Network" },
  "CDP": { description: "Customer Data Platform" },
  "CDT": { description: "Central Daylight Time" },
  "CIA": { description: "Central Intelligence Agency" },
  "CI": { description: "Continuous Integration" },
  "CI/CD": { description: "Continuous Integration/Continuous Delivery" },
  "CIAM": { description: "Customer Identity and Access Management" },
  "CICD": {
    description: "Continuous Integration Continuous Delivery",
    display: "CI/CD"
  },
  "CLI": { description: "Command Line Interface" },
  "CMDB": { description: "Configuration Management Database" },
  "CORS": { description: "Cross-Origin Resource Sharing" },
  "CPA": { description: "Certified Public Accountant" },
  "CPU": { description: "Central Processing Unit" },
  "CRUD": { description: "Create, Read, Update, Delete" },
  "CSR": {
    description: "Certificate Signing Request / Corporate Social Responsibility"
  },
  "CSS": { description: "Cascading Style Sheets" },
  "CST": { description: "Central Standard Time" },
  "CTA": { description: "Call To Action" },
  "CX": { description: "Customer Experience" },
  "DAG": { description: "Directed Acyclic Graph" },
  "DBMS": { description: "Database Management System" },
  "DDOS": { description: "Distributed Denial of Service", display: "DDoS" },
  "DEA": { description: "Drug Enforcement Administration" },
  "DEVOPS": { description: "Development Operations", display: "DevOps" },
  "DEVENV": { description: "DevEnv", display: "DevEnv" },
  "DIRENV": { description: "DirEnv", display: "DirEnv" },
  "DHS": { description: "Department of Homeland Security" },
  "DNC": { description: "Democratic National Committee / Do Not Call" },
  "DNS": { description: "Domain Name System" },
  "DNSSEC": { description: "Domain Name System Security Extensions" },
  "DOD": { description: "Department of Defense", display: "DoD" },
  "DOJ": { description: "Department of Justice", display: "DoJ" },
  "DOT": { description: "Department of Transportation", display: "DoT" },
  "DOM": { description: "Document Object Model" },
  "DR": { description: "Disaster Recovery" },
  "DRM": { description: "Digital Rights Management" },
  "DSN": { description: "Data Source Name" },
  "DWH": { description: "Data Warehouse" },
  "E2E": { description: "End to End" },
  "EAI": { description: "Enterprise Application Integration" },
  "EDT": { description: "Eastern Daylight Time" },
  "EEA": { description: "European Economic Area" },
  "EKS": { description: "Elastic Kubernetes Service" },
  "EOF": { description: "End Of File" },
  "EOD": { description: "End Of Day / Explosive Ordnance Disposal" },
  "EPA": { description: "Environmental Protection Agency" },
  "ER": { description: "Emergency Room / Entity Relationship" },
  "EST": { description: "Eastern Standard Time" },
  "ETC": { description: "Et Cetera" },
  "ETL": { description: "Extract, Transform, Load" },
  "EULA": { description: "End User License Agreement" },
  "FAQ": { description: "Frequently Asked Questions" },
  "FBI": { description: "Federal Bureau of Investigation" },
  "FCC": { description: "Federal Communications Commission" },
  "FDA": { description: "Food and Drug Administration" },
  "FIDO": { description: "Fast IDentity Online" },
  "FLOTUS": { description: "First Lady of the United States" },
  "FQDN": { description: "Fully Qualified Domain Name" },
  "FTC": { description: "Federal Trade Commission" },
  "FTP": { description: "File Transfer Protocol" },
  "FAAS": { description: "Function as a Service", display: "FaaS" },
  "GCP": { description: "Google Cloud Platform" },
  "GDPR": { description: "General Data Protection Regulation" },
  "GMT": { description: "Greenwich Mean Time" },
  "GOP": { description: "Grand Old Party" },
  "GPU": { description: "Graphics Processing Unit" },
  "GUID": { description: "Globally Unique Identifier" },
  "GUI": { description: "Graphical User Interface" },
  "GZIP": { description: "GNU Zip" },
  "HCI": {
    description: "Human Computer Interaction / Hyper-Converged Infrastructure"
  },
  "HDD": { description: "Hard Disk Drive" },
  "HDFS": { description: "Hadoop Distributed File System" },
  "HHS": { description: "Health and Human Services" },
  "HIPAA": {
    description: "Health Insurance Portability and Accountability Act"
  },
  "HMAC": { description: "Hash-based Message Authentication Code" },
  "HOTP": { description: "HMAC-based One-Time Password" },
  "HSM": { description: "Hardware Security Module" },
  "HTML": { description: "HyperText Markup Language" },
  "HTTP": { description: "HyperText Transfer Protocol (HTTP)" },
  "HTTP/2": { description: "HyperText Transfer Protocol Version 2 (HTTP/2)" },
  "HTTP/2.0": {
    description: "HyperText Transfer Protocol Version 2 (HTTP/2)",
    display: "HTTP2"
  },
  "HTTP2": {
    description: "HyperText Transfer Protocol Version 2 (HTTP/2)",
    display: "HTTP2"
  },
  "HTTP2.0": {
    description: "HyperText Transfer Protocol Version 2 (HTTP/2)",
    display: "HTTP2"
  },
  "HTTP/3": { description: "HyperText Transfer Protocol Version 3 (HTTP/3)" },
  "HTTP/3.0": {
    description: "HyperText Transfer Protocol Version 3 (HTTP/3)",
    display: "HTTP3"
  },
  "HTTP3": {
    description: "HyperText Transfer Protocol Version 3 (HTTP/3)",
    display: "HTTP3"
  },
  "HTTP3.0": {
    description: "HyperText Transfer Protocol Version 3 (HTTP/3)",
    display: "HTTP3"
  },
  "HTTPS": { description: "HyperText Transfer Protocol Secure (HTTPS)" },
  "HTTPS/2": {
    description: "HyperText Transfer Protocol Secure Version 2 (HTTPS/2)"
  },
  "HTTPS/2.0": {
    description: "HyperText Transfer Protocol Secure Version 2 (HTTPS/2)",
    display: "HTTPS2"
  },
  "HTTPS2": {
    description: "HyperText Transfer Protocol Secure Version 2 (HTTPS/2)",
    display: "HTTPS2"
  },
  "HTTPS2.0": {
    description: "HyperText Transfer Protocol Secure Version 2 (HTTPS/2)",
    display: "HTTPS2"
  },
  "HTTPS/3": {
    description: "HyperText Transfer Protocol Secure Version 3 (HTTPS/3)"
  },
  "HTTPS/3.0": {
    description: "HyperText Transfer Protocol Secure Version 3 (HTTPS/3)",
    display: "HTTPS3"
  },
  "HTTPS3": {
    description: "HyperText Transfer Protocol Secure Version 3 (HTTPS/3)",
    display: "HTTPS3"
  },
  "HTTPS3.0": {
    description: "HyperText Transfer Protocol Secure Version 3 (HTTPS/3)",
    display: "HTTPS3"
  },
  "IAM": { description: "Identity and Access Management" },
  "IAMM": { description: "Identity and Access Management and Monitoring" },
  "IAMT": { description: "Identity and Access Management Tool" },
  "IAAS": { description: "Infrastructure as a Service", display: "IaaS" },
  "ID": { description: "Identifier", display: "Id" },
  "IFTTT": { description: "If This Then That" },
  "IMAP": { description: "Internet Message Access Protocol" },
  "IP": { description: "Internet Protocol" },
  "IPFS": { description: "InterPlanetary File System" },
  "IPS": { description: "Intrusion Prevention System" },
  "IQ": { description: "Intelligence Quotient", display: "IQ" },
  "IO": { description: "Input/Output" },
  "IOT": { description: "Internet of Things", display: "IoT" },
  "JSON": { description: "JavaScript Object Notation" },
  "JSONP": { description: "JSON with Padding" },
  "JWT": { description: "JSON Web Token" },
  "K8S": { description: "Kubernetes", display: "K8s" },
  "KMS": { description: "Key Management Service" },
  "KPI": { description: "Key Performance Indicator" },
  "KV": { description: "Key Value" },
  "LAN": { description: "Local Area Network" },
  "LHS": { description: "Left Hand Side" },
  "LPGA": { description: "Ladies Professional Golf Association" },
  "LXC": { description: "Linux Containers" },
  "MDT": { description: "Mountain Daylight Time" },
  "MFA": { description: "Multi-Factor Authentication" },
  "ML": { description: "Machine Learning" },
  "MLB": { description: "Major League Baseball" },
  "MLOps": { description: "Machine Learning Operations" },
  "MST": { description: "Mountain Standard Time" },
  "MVC": { description: "Model View Controller" },
  "MVP": { description: "Minimum Viable Product / Most Valuable Player" },
  "NAIA": { description: "National Association of Intercollegiate Athletics" },
  "NAS": { description: "Network Attached Storage" },
  "NASCAR": { description: "National Association for Stock Car Auto Racing" },
  "NASA": { description: "National Aeronautics and Space Administration" },
  "NAT": { description: "Network Address Translation" },
  "NBA": { description: "National Basketball Association" },
  "NCAA": { description: "National Collegiate Athletic Association" },
  "NDA": { description: "Non-Disclosure Agreement" },
  "NFS": { description: "Network File System" },
  "NHL": { description: "National Hockey League" },
  "NIST": { description: "National Institute of Standards and Technology" },
  "NLP": { description: "Natural Language Processing" },
  "NPS": { description: "Net Promoter Score" },
  "NRA": { description: "National Rifle Association" },
  "NSFW": { description: "Not Safe For Work" },
  "NX": { description: "Nx", display: "Nx" },
  "OCR": { description: "Optical Character Recognition" },
  "OEM": { description: "Original Equipment Manufacturer" },
  "OKR": { description: "Objectives and Key Results" },
  "OLAP": { description: "Online Analytical Processing" },
  "OLTP": { description: "Online Transaction Processing" },
  "OOP": { description: "Object Oriented Programming" },
  "ORM": { description: "Object Relational Mapping" },
  "OS": { description: "Operating System" },
  "OSS": { description: "Open Source Software" },
  "OSINT": { description: "Open Source Intelligence" },
  "OTP": { description: "One-Time Password" },
  "P2P": { description: "Peer to Peer" },
  "PDP": { description: "Policy Decision Point / Product Detail Page" },
  "PDT": { description: "Pacific Daylight Time" },
  "PGA": { description: "Professional Golfers' Association" },
  "POTUS": { description: "President of the United States" },
  "PST": { description: "Pacific Standard Time" },
  "PTO": { description: "Paid Time Off / Power Take-Off" },
  "PAAS": { description: "Platform as a Service", display: "PaaS" },
  "PCI": { description: "Payment Card Industry" },
  "PKI": { description: "Public Key Infrastructure" },
  "PP": { description: "Pages / PayPal / Percentage Points" },
  "PWA": { description: "Progressive Web App" },
  "PX": { description: "Pixel" },
  "QA": { description: "Quality Assurance" },
  "R2": { description: "R2" },
  "RAID": { description: "Redundant Array of Independent Disks" },
  "RAM": { description: "Random Access Memory" },
  "RDS": { description: "Relational Database Service" },
  "REST": { description: "Representational State Transfer" },
  "RHS": { description: "Right Hand Side" },
  "ROI": { description: "Return on Investment" },
  "RPC": { description: "Remote Procedure Call" },
  "RPA": { description: "Robotic Process Automation" },
  "RUM": { description: "Real User Monitoring" },
  "RSS": { description: "Really Simple Syndication" },
  "S3": { description: "Simple Storage Service (S3)" },
  "SAN": { description: "Storage Area Network" },
  "SASE": { description: "Secure Access Service Edge" },
  "SCOTUS": { description: "Supreme Court of the United States" },
  "SDLC": { description: "Software Development Life Cycle" },
  "SDK": { description: "Software Development Kit" },
  "SEC": { description: "Securities and Exchange Commission" },
  "SEO": { description: "Search Engine Optimization" },
  "SFTP": {
    description: "SSH File Transfer Protocol / Secure File Transfer Protocol"
  },
  "SIEM": { description: "Security Information and Event Management" },
  "SLA": { description: "Service Level Agreement" },
  "SMB": { description: "Server Message Block / Small and Medium Business" },
  "SMTP": { description: "Simple Mail Transfer Protocol" },
  "SOAP": { description: "Simple Object Access Protocol" },
  "SOC": { description: "Security Operations Center / System on Chip" },
  "SOA": { description: "Service Oriented Architecture" },
  "SPDY": { description: 'Speedy (pronounced "SPeeDY")' },
  "SPF": { description: "Sender Policy Framework" },
  "SQL": { description: "Structured Query Language" },
  "SRV": { description: "Service" },
  "SRE": { description: "Site Reliability Engineering" },
  "SSH": { description: "Secure Shell" },
  "SSDL": { description: "Secure Software Development Lifecycle" },
  "SSO": { description: "Single Sign-On" },
  "SSL": { description: "Secure Sockets Layer" },
  "SSR": { description: "Server Side Rendering" },
  "TDD": { description: "Test Driven Development" },
  "TLD": { description: "Top Level Domain" },
  "TLS": { description: "Transport Layer Security" },
  "TLS1.3": { description: "Transport Layer Security 1.3" },
  "TOTP": { description: "Time-based One-Time Password" },
  "TRPC": { description: "TypeScript Remote Procedure Call" },
  "TSA": { description: "Transportation Security Administration" },
  "TTL": { description: "Time To Live" },
  "UDP": { description: "User Datagram Protocol" },
  "UI": { description: "User Interface" },
  "UID": { description: "Unique Identifier" },
  "URI": { description: "Uniform Resource Identifier" },
  "URL": { description: "Uniform Resource Locator" },
  "USOPC": { description: "United States Olympic & Paralympic Committee" },
  "USPS": { description: "United States Postal Service" },
  "USTA": { description: "United States Tennis Association" },
  "UTF": { description: "Unicode Transformation Format" },
  "UTC": { description: "Coordinated Universal Time" },
  "UUID": { description: "Universally Unique Identifier" },
  "UX": { description: "User Experience" },
  "VM": { description: "Virtual Machine" },
  "VLAN": { description: "Virtual Local Area Network" },
  "VPN": { description: "Virtual Private Network" },
  "VPPA": { description: "Video Privacy Protection Act" },
  "VR": { description: "Virtual Reality" },
  "WAF": { description: "Web Application Firewall" },
  "WAN": { description: "Wide Area Network" },
  "WNBA": { description: "Women's National Basketball Association" },
  "WLAN": { description: "Wireless Local Area Network" },
  "WPA": { description: "Wi-Fi Protected Access" },
  "XACML": { description: "eXtensible Access Control Markup Language" },
  "XDG": { description: "Cross-Desktop Group" },
  "XML": { description: "eXtensible Markup Language" },
  "XSRF": { description: "Cross-Site Request Forgery" },
  "XSS": { description: "Cross-Site Scripting" },
  "XR": { description: "Extended Reality" },
  "YMCA": { description: "Young Men's Christian Association" },
  "YAML": { description: "YAML Ain't Markup Language" },
  "YWCA": { description: "Young Women's Christian Association" },
  "ZTA": { description: "Zero Trust Architecture" }
} as const;

export const ACRONYM_DISPLAY: Record<string, string> = Object.fromEntries(
  Object.entries(ACRONYMS).map(([key, value]) => [key, value.display ?? key])
);

export const ACRONYM_DESCRIPTION: Record<string, string> = Object.fromEntries(
  Object.entries(ACRONYMS).map(([key, value]) => [key, value.description])
);

export const ACRONYM_LIST: string[] = Object.keys(ACRONYMS);
