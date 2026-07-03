// generate-state-pages.js
// Run: node generate-state-pages.js
// Generates doctors-place/workoccmed/states/*.html (one per state)
// and doctors-place/workoccmed/cities/*.html (one per major city)

const fs = require('fs');
const path = require('path');

const STATES = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison'] },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Palmer', 'Bethel'] },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise'] },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'North Little Rock', 'Conway', 'Rogers', 'Bentonville', 'Pine Bluff'] },
  { name: 'California', slug: 'california', abbr: 'CA', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Riverside', 'Stockton', 'Modesto', 'Chula Vista', 'Irvine'] },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Boulder'] },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', cities: ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'West Hartford', 'Greenwich'] },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle'] },
  { name: 'Florida', slug: 'florida', abbr: 'FL', cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Port St. Lucie', 'Tallahassee', 'Fort Lauderdale', 'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Gainesville', 'Miramar', 'Coral Springs'] },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Albany'] },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', cities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani', 'Kahului', 'Ewa Beach', 'Kihei'] },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Lewiston', 'Post Falls'] },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Cicero', 'Bloomington', 'Decatur', 'Evanston', 'Schaumburg'] },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Lafayette'] },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Council Bluffs', 'Ames', 'West Des Moines', 'Dubuque'] },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence', 'Shawnee', 'Manhattan', 'Lenexa', 'Salina'] },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond', 'Georgetown', 'Florence', 'Hopkinsville', 'Nicholasville'] },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Metairie', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria'] },
  { name: 'Maine', slug: 'maine', abbr: 'ME', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford', 'Sanford', 'Augusta', 'Saco', 'Westbrook'] },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Annapolis', 'College Park', 'Salisbury', 'Laurel'] },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy', 'Lynn', 'Fall River'] },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy', 'Westland', 'Kalamazoo', 'Farmington Hills', 'Clinton Township', 'Canton'] },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'Maple Grove', 'Woodbury', 'St. Cloud'] },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Olive Branch', 'Greenville', 'Horn Lake'] },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', "Lee's Summit", 'O\'Fallon', 'St. Joseph', 'St. Charles', 'Blue Springs'] },
  { name: 'Montana', slug: 'montana', abbr: 'MT', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City'] },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'North Platte', 'Norfolk', 'Columbus'] },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City'] },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack', 'Hudson', 'Bedford'] },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Clifton', 'Camden', 'Passaic', 'Hackensack', 'Bayonne', 'East Orange', 'Vineland', 'Union City', 'Edison', 'Woodbridge'] },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'Clovis', 'Hobbs', 'Alamogordo', 'Carlsbad'] },
  { name: 'New York', slug: 'new-york', abbr: 'NY', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'] },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord'] },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Wahpeton'] },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain', 'Hamilton', 'Springfield', 'Kettering', 'Elyria', 'Lakewood'] },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater'] },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', cities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis'] },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'York', 'Wilkes-Barre', 'Chester', 'State College', 'Norristown'] },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', cities: ['Providence', 'Cranston', 'Warwick', 'Pawtucket', 'East Providence', 'Woonsocket', 'Coventry', 'North Providence', 'Cumberland', 'West Warwick'] },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', cities: ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Goose Creek', 'Hilton Head Island', 'Sumter'] },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Vermillion'] },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett'] },
  { name: 'Texas', slug: 'texas', abbr: 'TX', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Irving', 'Garland', 'Frisco', 'McKinney', 'Amarillo', 'Grand Prairie', 'Killeen', 'Beaumont', 'Midland'] },
  { name: 'Utah', slug: 'utah', abbr: 'UT', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'South Jordan'] },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Vergennes', 'Middlebury'] },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth', 'Suffolk'] },
  { name: 'Washington', slug: 'washington', abbr: 'WA', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Spokane Valley', 'Kirkland'] },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Martinsburg', 'Beckley', 'Clarksburg'] },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville'] },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson'] },
];

// ─── Site count lookup ───────────────────────────────────────────────────────
const STATE_SITES = {
  'california':2800,'texas':2400,'new-york':2200,'florida':2100,'illinois':1600,
  'pennsylvania':1500,'ohio':1400,'michigan':1100,'georgia':1200,'north-carolina':1100,
  'new-jersey':1000,'virginia':900,'arizona':900,'washington':850,'indiana':800,
  'tennessee':800,'massachusetts':800,'colorado':750,'minnesota':700,'maryland':700,
  'wisconsin':650,'missouri':650,'alabama':550,'south-carolina':550,'louisiana':550,
  'kentucky':500,'oregon':500,'oklahoma':500,'connecticut':450,'utah':450,
  'iowa':420,'nevada':420,'arkansas':380,'mississippi':360,'kansas':360,
  'new-mexico':320,'nebraska':300,'west-virginia':280,'idaho':260,'hawaii':200,
  'new-hampshire':200,'maine':190,'rhode-island':190,'montana':180,'delaware':170,
  'south-dakota':150,'north-dakota':145,'alaska':140,'vermont':130,'wyoming':120
};
const CITY_SHARES = [22,16,13,10,8,7,6,6,6,6,4,4,3,3,3,3,2,2,2,2];
function getSites(stateSlug, cityIndex) {
  const total = STATE_SITES[stateSlug] || 350;
  const share = CITY_SHARES[Math.min(cityIndex, CITY_SHARES.length - 1)] / 100;
  return Math.max(10, Math.round(total * share));
}

const SHARED_CSS = `
  :root{--navy:#1e40af;--teal:#0891b2;--text:#0f172a;--muted:#475569;--border:#e2e8f0;--cream:#eff6ff;}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:#ffffff;color:var(--text);line-height:1.6;}
  nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:68px;border-bottom:1px solid #f1f5f9;box-shadow:0 1px 12px rgba(0,0,0,0.06);}
  .nav-logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
  .logo-mark{width:38px;height:38px;background:linear-gradient(135deg,#1e40af,#0891b2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:19px;color:white;font-weight:700;box-shadow:0 2px 8px rgba(30,64,175,0.25);}
  .logo-name{font-family:'Inter',sans-serif;font-size:22px;font-weight:700;color:#0f172a;line-height:1.2;}
  .logo-sub{font-size:15px;color:#94a3b8;letter-spacing:.12em;text-transform:uppercase;}
  .nav-links{display:flex;align-items:center;gap:24px;list-style:none;}
  .nav-links a{color:#475569;text-decoration:none;font-size:19px;font-weight:500;transition:color .2s;}
  .nav-links a:hover{color:#1e40af;}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:8px;font-family:'Inter',sans-serif;font-size:18px;font-weight:600;text-decoration:none;white-space:nowrap;transition:all .2s;}
  .btn-primary{background:#1e40af;color:white;box-shadow:0 2px 8px rgba(30,64,175,0.25);}
  .btn-primary:hover{background:#1d3fa5;}
  .btn-ghost{border:1px solid #e2e8f0;color:#475569;background:transparent;}
  .btn-ghost:hover{border-color:#93c5fd;color:#1e40af;}
  .hero{padding-top:68px;background:#ffffff;position:relative;overflow:hidden;min-height:420px;display:flex;align-items:center;}
  .hero::after{content:'';position:absolute;top:0;right:0;width:42%;height:100%;background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);clip-path:polygon(12% 0,100% 0,100% 100%,0 100%);pointer-events:none;}
  .hero-inner{position:relative;z-index:2;max-width:100%;margin:0 auto;padding:72px 48px 64px;width:100%;}
  .breadcrumb{display:flex;align-items:center;gap:8px;margin-bottom:20px;font-size:18px;color:#94a3b8;}
  .breadcrumb a{color:#94a3b8;text-decoration:none;transition:color .2s;}
  .breadcrumb a:hover{color:#1e40af;}
  .breadcrumb span{color:#cbd5e1;}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;padding:6px 14px;border-radius:100px;font-size:17px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px;}
  .hero h1{font-family:'Inter',sans-serif;font-weight:800;font-size:clamp(2rem,3.5vw,3rem);line-height:1.1;color:#0f172a;margin-bottom:14px;}
  .hero h1 span{color:#1e40af;}
  .hero-sub{font-size:21px;color:#475569;margin-bottom:32px;line-height:1.7;max-width:580px;}
  .hero-ctas{display:flex;gap:12px;flex-wrap:wrap;}
  .btn-white{background:#1e40af;color:white;font-family:'Inter',sans-serif;font-size:20px;font-weight:700;padding:13px 26px;border-radius:10px;text-decoration:none;box-shadow:0 4px 16px rgba(30,64,175,.3);display:inline-flex;align-items:center;gap:8px;transition:all .2s;}
  .btn-white:hover{background:#1d3fa5;transform:translateY(-1px);}
  .btn-outline{background:white;color:#1e40af;border:1.5px solid #bfdbfe;font-family:'Inter',sans-serif;font-size:20px;font-weight:600;padding:13px 26px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .2s;}
  .btn-outline:hover{border-color:#1e40af;background:#eff6ff;}
  .stats-bar{background:#0f172a;display:grid;grid-template-columns:repeat(4,1fr);}
  .stat{padding:22px;text-align:center;border-right:1px solid rgba(255,255,255,.06);}
  .stat:last-child{border-right:none;}
  .stat-n{font-family:'Inter',sans-serif;font-size:2.6rem;font-weight:800;color:#38bdf8;}
  .stat-l{font-size:17px;color:#64748b;letter-spacing:.04em;margin-top:6px;}
  section{padding:72px 48px;}
  .inner{max-width:100%;margin:0 auto;}
  .label{font-size:17px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:10px;}
  .title{font-family:'DM Serif Display',serif;font-size:clamp(1.8rem,3vw,2.4rem);color:var(--text);margin-bottom:14px;line-height:1.2;}
  .sub{font-size:21px;color:var(--muted);line-height:1.7;max-width:640px;}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px;}
  .card{background:white;border:1px solid var(--border);border-radius:16px;padding:28px;transition:all .2s;}
  .card:hover{box-shadow:0 8px 24px rgba(30,64,175,.08);border-color:#bfdbfe;transform:translateY(-2px);}
  .card-icon{font-size:34px;margin-bottom:14px;}
  .card h3{font-size:21px;font-weight:700;margin-bottom:8px;color:#0f172a;}
  .card p{font-size:18px;color:var(--muted);line-height:1.65;}
  .price-tag{display:inline-block;margin-top:14px;font-size:18px;font-weight:700;color:#1e40af;background:#eff6ff;padding:4px 12px;border-radius:100px;}
  .city-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-top:32px;}
  .city-chip{background:white;border:1px solid var(--border);border-radius:10px;padding:11px 15px;text-decoration:none;color:#334155;font-size:18px;font-weight:500;transition:all .2s;display:flex;align-items:center;gap:8px;}
  .city-chip:hover{border-color:#1e40af;color:#1e40af;background:#eff6ff;}
  .city-chip::before{content:'';}
  .how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:40px;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:white;}
  .how-step{padding:28px;border-right:1px solid var(--border);}
  .how-step:last-child{border-right:none;}
  .step-n{width:40px;height:40px;border-radius:50%;background:#1e40af;color:white;font-weight:800;font-size:21px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
  .how-step h3{font-size:20px;font-weight:700;margin-bottom:8px;color:#0f172a;}
  .how-step p{font-size:18px;color:var(--muted);line-height:1.6;}
  .faq-list{max-width:100%;margin-top:40px;display:flex;flex-direction:column;gap:10px;}
  .faq-item{background:white;border:1px solid var(--border);border-radius:14px;overflow:hidden;}
  .faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:18px 22px;font-family:'DM Sans',sans-serif;font-size:20px;font-weight:600;color:#0f172a;display:flex;justify-content:space-between;align-items:center;gap:16px;}
  .faq-q::after{content:'+';font-size:26px;color:#0891b2;flex-shrink:0;}
  .faq-q.open::after{content:'−';}
  .faq-a{display:none;padding:0 22px 18px;font-size:19px;color:var(--muted);line-height:1.7;}
  .faq-a.open{display:block;}
  .cta-strip{background:#0f172a;padding:72px 48px;text-align:center;}
  .cta-strip h2{font-family:'DM Serif Display',serif;font-size:clamp(1.8rem,3vw,2.6rem);color:white;margin-bottom:14px;}
  .cta-strip p{font-size:22px;color:#94a3b8;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;}
  .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
  .cta-btn-primary{background:white;color:#1e40af;font-family:'DM Sans',sans-serif;font-size:20px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
  .cta-btn-outline{background:rgba(255,255,255,.08);color:#94a3b8;border:1px solid rgba(255,255,255,.12);font-family:'DM Sans',sans-serif;font-size:20px;font-weight:500;padding:14px 28px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
  footer{background:#0f172a;color:#94a3b8;padding:48px;border-top:1px solid #1e293b;}
  .footer-inner{max-width:100%;margin:0 auto;}
  .footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
  .f-brand-name{font-family:'DM Serif Display',serif;font-size:26px;color:white;margin-bottom:4px;}
  .f-brand-sub{font-size:17px;color:#475569;margin-bottom:14px;}
  .f-brand-desc{font-size:18px;color:#64748b;line-height:1.6;}
  .f-col h4{font-size:17px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#475569;margin-bottom:16px;}
  .f-col a{display:block;font-size:18px;color:#64748b;text-decoration:none;margin-bottom:10px;transition:color .2s;}
  .f-col a:hover{color:white;}
  .footer-bottom{border-top:1px solid #1e293b;padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
  .f-legal{font-size:17px;color:#475569;}
  .f-legal a{color:#475569;text-decoration:none;}
  @media(max-width:100%){nav{padding:0 20px;}.nav-links,.nav-cta{display:none;}section{padding:48px 24px;}.hero-inner{padding:52px 24px 44px;}.hero::after{width:100%;clip-path:none;opacity:.3;}.grid-3{grid-template-columns:1fr;}.how-grid{grid-template-columns:1fr 1fr;}.stats-bar{grid-template-columns:repeat(2,1fr);}.footer-top{grid-template-columns:1fr 1fr;}.cta-strip{padding:56px 24px;}footer{padding:40px 24px;}}
  @media(max-width:600px){.footer-top{grid-template-columns:1fr;}.footer-bottom{flex-direction:column;text-align:center;}.how-grid{grid-template-columns:1fr;}.hero-ctas{flex-direction:column;}.hero-ctas a{text-align:center;justify-content:center;}}
`;

function statePageHtml(state) {
  const { name, slug, abbr, cities } = state;
  const cityList = cities.slice(0, 10);
  const topCity = cities[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-K8FTWVMH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-K8FTWVMH');
  gtag('config', 'AW-18239837170');
</script>
<title>${name} DOT Physicals & Drug Testing — $110, Same-Day | WorkOccMed</title>
<meta name="description" content="Order DOT physicals ($110) & drug testing online in ${name}. FMCSA-certified, same-day medical card, 15,000+ sites statewide. No account needed — order in 2 minutes.">
<link rel="canonical" href="https://www.workoccmed.com/states/${slug}">
<meta property="og:title" content="Occupational Health ${name} | Work OccMed">
<meta property="og:description" content="DOT physicals, pre-employment drug testing, and workplace drug screening in ${name}. 15,000+ collection sites. Order online.">
<meta property="og:url" content="https://www.workoccmed.com/states/${slug}">
<meta property="og:site_name" content="Work OccMed">
<meta name="robots" content="index, follow">
<meta name="keywords" content="occupational health ${name}, DOT physical ${name}, DOT physical ${abbr}, workplace drug testing ${name}, pre-employment drug test ${name}, drug screening ${name}, CDL physical ${name}, FMCSA physical ${name}, fit for duty ${name}, occupational medicine ${name}, employer drug testing ${name}, random drug testing ${name}, work occmed ${name}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Occupational Health Services in ${name}",
  "provider": { "@type": "Organization", "name": "Work OccMed", "url": "https://www.workoccmed.com", "telephone": "+18882334567" },
  "areaServed": { "@type": "State", "name": "${name}", "containedInPlace": { "@type": "Country", "name": "United States" } },
  "serviceType": ["DOT Physical Examination","Pre-Employment Drug Testing","Workplace Drug Screening","Fit for Duty Evaluation","Return to Duty Drug Testing","Random Drug Testing Program"],
  "url": "https://www.workoccmed.com/states/${slug}"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Where can I get a DOT physical in ${name}?", "acceptedAnswer": { "@type": "Answer", "text": "Work OccMed has 15,000+ certified collection and exam sites across the country, including sites throughout ${name}. Order online at workoccmed.com and direct your driver to the nearest authorized site — no appointment needed at most locations." } },
    { "@type": "Question", "name": "Does Work OccMed serve employers in ${name}?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Work OccMed provides full-service occupational health programs for employers in ${name} including pre-employment physicals, DOT drug testing, random testing consortiums, and workplace drug screening. Manage everything from your online employer portal." } }
  ]
}
</script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${SHARED_CSS}</style>
</head>
<body>

<nav>
  <a href="../" class="nav-logo">
    <div class="logo-mark">WO</div>
    <div>
      <div class="logo-name">Work OccMed</div>
      <div class="logo-sub">Occupational Health Services</div>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="../#services">Services</a></li>
    <li><a href="../#how-it-works">How It Works</a></li>
    <li><a href="../#coverage">All States</a></li>
    <li><a href="../return-to-duty">Return to Duty</a></li>
  </ul>
  <div class="nav-cta" style="display:flex;gap:10px;align-items:center;">
    <a href="tel:+18882334567" class="btn btn-ghost">(888) 233-4567</a>
    <a href="https://portal.dot-physical.net/signup" class="btn btn-primary">Employer Portal →</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <div class="breadcrumb">
      <a href="../">Work OccMed</a>
      <span>›</span>
      <a href="../#coverage">States</a>
      <span>›</span>
      <span style="color:rgba(255,255,255,.85);">${name}</span>
    </div>
    <div class="hero-badge">${name} · All Major Cities</div>
    <h1>Occupational Health<br><span>${name}</span></h1>
    <p class="hero-sub">DOT physicals, pre-employment drug testing, workplace drug screening, random testing programs, and fitness-for-duty evaluations for employers throughout ${name}. Order online — results in 24–72 hours.</p>
    <div class="hero-ctas">
      <a href="https://portal.dot-physical.net/order" class="btn-white">Order Now →</a>
      <a href="tel:+18882334567" class="btn-outline">(888) 233-4567</a>
    </div>
  </div>
</section>

<div class="stats-bar">
  <div class="stat"><div class="stat-n">15,000+</div><div class="stat-l">Collection Sites Nationwide</div></div>
  <div class="stat"><div class="stat-n">24–72h</div><div class="stat-l">Result Turnaround</div></div>
  <div class="stat"><div class="stat-n">All 50</div><div class="stat-l">States Covered</div></div>
  <div class="stat"><div class="stat-n">100%</div><div class="stat-l">FMCSA Compliant</div></div>
</div>

<section style="background:white;">
  <div class="inner">
    <div class="label">Services in ${name}</div>
    <h2 class="title">Occupational Health Programs for ${name} Employers</h2>
    <p class="sub">Whether you employ CDL drivers, construction workers, healthcare staff, or warehouse teams in ${name}, Work OccMed manages your entire occupational health program online.</p>
    <div class="grid-3">
      <div class="card">
        <h3>DOT Physical Exam</h3>
        <p>FMCSA-certified DOT physical examinations for CDL drivers and DOT-regulated employees in ${name}. MCSA-5875 form and Medical Examiner Certificate issued.</p>
        <span class="price-tag">From $110</span>
      </div>
      <div class="card">
        <h3>Pre-Employment Drug Screen</h3>
        <p>5-panel and 10-panel urine drug screens for new hires across ${name}. MRO-reviewed results delivered to your employer portal in 24–72 hours.</p>
        <span class="price-tag">From $80</span>
      </div>
      <div class="card">
        <h3>DOT Drug & Alcohol Testing</h3>
        <p>DOT-compliant drug and alcohol testing for CDL drivers in ${name} — pre-employment, random, post-accident, reasonable suspicion, and return to duty.</p>
        <span class="price-tag">From $80</span>
      </div>
      <div class="card">
        <h3>DOT Consortium Enrollment</h3>
        <p>Enroll your ${name} drivers in our FMCSA-compliant random testing consortium. Annual plans include random selection pool, recordkeeping, and compliance reports.</p>
        <span class="price-tag">From $49/yr</span>
      </div>
      <div class="card">
        <h3>Pre-Employment Physical</h3>
        <p>Non-DOT pre-employment physicals for construction, manufacturing, healthcare, and all industries in ${name}. Vision, hearing, lift testing, and more.</p>
        <span class="price-tag">From $110</span>
      </div>
      <div class="card">
        <h3>Return to Duty Testing</h3>
        <p>DOT return to duty drug testing after SAP completion, and non-DOT fitness-for-duty evaluations after injury or illness for ${name} employees.</p>
        <a href="../return-to-duty" style="display:inline-block;margin-top:12px;font-size:18px;font-weight:600;color:#1e40af;text-decoration:none;">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8faff;">
  <div class="inner">
    <div class="label">Coverage in ${name}</div>
    <h2 class="title">Cities We Serve in ${name}</h2>
    <p class="sub">Work OccMed has authorized collection sites throughout ${name}. Direct your employees to the nearest site — most require no appointment.</p>
    <div class="city-grid">
      ${cities.map((c, i) => `<a href="../cities/${slug}-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="city-chip">${c} <span style="font-size:16px;font-weight:500;opacity:0.7;margin-left:3px;">${getSites(slug, i)} sites</span></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section style="background:white;" id="how">
  <div class="inner">
    <div class="label">How It Works</div>
    <h2 class="title">Order ${name} Occupational Health Services in 4 Steps</h2>
    <div class="how-grid">
      <div class="how-step">
        <div class="step-n">1</div>
        <h3>Create Your Employer Account</h3>
        <p>Sign up for free at portal.dot-physical.net. Add your ${name} employees and configure your testing program in minutes.</p>
      </div>
      <div class="how-step">
        <div class="step-n">2</div>
        <h3>Place an Order</h3>
        <p>Select the service — DOT physical, drug screen, or consortium enrollment — and generate an authorization for your employee.</p>
      </div>
      <div class="how-step">
        <div class="step-n">3</div>
        <h3>Employee Visits Collection Site</h3>
        <p>Your employee takes the authorization to any Work OccMed-affiliated site in ${name}. No appointment needed at most locations.</p>
      </div>
      <div class="how-step">
        <div class="step-n">4</div>
        <h3>Results to Your Portal</h3>
        <p>MRO-reviewed results appear in your employer portal within 24–72 hours. Download, share, or archive — all in one place.</p>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8faff;" id="faq">
  <div class="inner">
    <div class="label">FAQ — ${name}</div>
    <h2 class="title">Common Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">Do CDL drivers in ${name} need a DOT physical?</button>
        <div class="faq-a">Yes. All CDL drivers operating in interstate commerce — and many intrastate drivers in ${name} — are required to pass a DOT physical examination conducted by an FMCSA-certified medical examiner. The exam must be renewed every 24 months (or more frequently if the examiner notes a health condition). Work OccMed can schedule DOT physicals at sites throughout ${name}.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">How do I set up a drug testing program for my ${name} employees?</button>
        <div class="faq-a">Create a free employer account at portal.dot-physical.net. You can set up DOT-compliant or non-DOT drug testing programs, enroll DOT-regulated drivers in a random testing consortium, and order individual tests — all from one dashboard. Work OccMed manages the MRO review, chain of custody, and result delivery so you stay compliant without the administrative burden.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">What cities in ${name} have Work OccMed collection sites?</button>
        <div class="faq-a">Work OccMed has access to 15,000+ affiliated collection and examination sites nationwide, with broad coverage across ${name} including ${cityList.slice(0,5).join(', ')}, and more. When you place an order through your employer portal, the employee authorization includes the nearest available sites to their location.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">How quickly are drug test results returned for ${name} employees?</button>
        <div class="faq-a">Most negative results are returned within 24–48 hours. Non-negative results go through MRO review and are typically finalized within 72 hours. All results are delivered directly to your secure employer portal at portal.dot-physical.net — no faxing, no phone tag.</div>
      </div>
    </div>
  </div>
</section>

<div class="cta-strip">
  <h2>Ready to Manage ${name} Occupational Health?</h2>
  <p>Set up your employer account in minutes. No setup fees.</p>
  <div class="cta-btns">
    <a href="https://portal.dot-physical.net/signup" class="cta-btn-primary">Create Free Account →</a>
    <a href="mailto:occmed@doctors-place.com" class="cta-btn-outline">occmed@doctors-place.com</a>
    <a href="tel:+18882334567" class="cta-btn-outline">(888) 233-4567</a>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="f-brand-name">Work OccMed</div>
        <div class="f-brand-sub">A Doctors Place Company</div>
        <p class="f-brand-desc">Full-service occupational health for employers nationwide. DOT physicals, drug testing, OSHA screenings, and return to duty — all managed online.</p>
      </div>
      <div class="f-col">
        <h4>Services</h4>
        <a href="../#services">Pre-Employment Physical</a>
        <a href="../#services">DOT Physical Exam</a>
        <a href="../#services">Drug Testing</a>
        <a href="../#services">Random Testing</a>
        <a href="../return-to-duty">Return to Duty</a>
      </div>
      <div class="f-col">
        <h4>Employers</h4>
        <a href="https://portal.dot-physical.net/signup">Create Account</a>
        <a href="https://portal.dot-physical.net/join-consortium">DOT Consortium</a>
        <a href="https://portal.dot-physical.net/order">Order a Test</a>
        <a href="../#coverage">All States</a>
      </div>
      <div class="f-col">
        <h4>Contact</h4>
        <a href="tel:+18882334567">(888) 233-4567</a>
        <a href="mailto:occmed@doctors-place.com">occmed@doctors-place.com</a>
        <a href="https://portal.dot-physical.net">Employer Portal</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="f-legal">© 2026 Work OccMed · A Doctors Place Company · Doctors Place Inc.</div>
      <div class="f-legal"><a href="https://portal.dot-physical.net/privacy">Privacy Policy</a> · <a href="../">Work OccMed Home</a></div>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function cityPageHtml(state, city, cityIndex) {
  const { name: stateName, slug: stateSlug, abbr } = state;
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fullSlug = `${stateSlug}-${citySlug}`;
  const sites = getSites(stateSlug, cityIndex);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-K8FTWVMH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-K8FTWVMH');
  gtag('config', 'AW-18239837170');
</script>
<title>${city} DOT Physical $110 & Drug Testing — Order Online | WorkOccMed</title>
<meta name="description" content="DOT physicals & drug testing in ${city}, ${stateName}. $110, same-day medical card, FMCSA-certified sites near you. Order online in 2 minutes — no account needed.">
<link rel="canonical" href="https://www.workoccmed.com/cities/${fullSlug}">
<meta name="robots" content="index, follow">
<meta name="keywords" content="DOT physical ${city}, occupational health ${city} ${stateName}, drug testing ${city} ${abbr}, pre-employment physical ${city}, workplace drug screen ${city}, CDL physical ${city} ${abbr}, drug test ${city} ${stateName}, work occmed ${city}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Occupational Health Services in ${city}, ${stateName}",
  "provider": { "@type": "Organization", "name": "Work OccMed", "url": "https://www.workoccmed.com", "telephone": "+18882334567" },
  "areaServed": { "@type": "City", "name": "${city}", "containedInPlace": { "@type": "State", "name": "${stateName}" } },
  "serviceType": ["DOT Physical Examination","Pre-Employment Drug Testing","Workplace Drug Screening","Fit for Duty Evaluation","Return to Duty Drug Testing"],
  "url": "https://www.workoccmed.com/cities/${fullSlug}"
}
</script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${SHARED_CSS}</style>
</head>
<body>

<nav>
  <a href="../" class="nav-logo">
    <div class="logo-mark">WO</div>
    <div>
      <div class="logo-name">Work OccMed</div>
      <div class="logo-sub">Occupational Health Services</div>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="../#services">Services</a></li>
    <li><a href="../states/${stateSlug}">${stateName}</a></li>
    <li><a href="../return-to-duty">Return to Duty</a></li>
  </ul>
  <div class="nav-cta" style="display:flex;gap:10px;align-items:center;">
    <a href="tel:+18882334567" class="btn btn-ghost">(888) 233-4567</a>
    <a href="https://portal.dot-physical.net/signup" class="btn btn-primary">Employer Portal →</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <div class="breadcrumb">
      <a href="../">Work OccMed</a>
      <span>›</span>
      <a href="../states/${stateSlug}">${stateName}</a>
      <span>›</span>
      <span style="color:rgba(255,255,255,.85);">${city}</span>
    </div>
    <div class="hero-badge">${city}, ${stateName}</div>
    <h1>Occupational Health<br><span>${city}, ${abbr}</span></h1>
    <p class="hero-sub">DOT physicals, pre-employment drug testing, and workplace drug screening for employers in ${city}, ${stateName}. ${sites}+ authorized collection sites near ${city} — order online, results in 24–72 hours.</p>
    <div class="hero-ctas">
      <a href="https://portal.dot-physical.net/order" class="btn-white">Order Now →</a>
      <a href="tel:+18882334567" class="btn-outline">(888) 233-4567</a>
    </div>
  </div>
</section>

<div class="stats-bar">
  <div class="stat"><div class="stat-n">${sites}+</div><div class="stat-l">Sites Near ${city}</div></div>
  <div class="stat"><div class="stat-n">24–72h</div><div class="stat-l">Result Turnaround</div></div>
  <div class="stat"><div class="stat-n">All 50</div><div class="stat-l">States Covered</div></div>
  <div class="stat"><div class="stat-n">100%</div><div class="stat-l">FMCSA Compliant</div></div>
</div>

<section style="background:white;">
  <div class="inner">
    <div class="label">Services in ${city}, ${stateName}</div>
    <h2 class="title">Occupational Health for ${city} Employers</h2>
    <p class="sub">Work OccMed connects ${city} employers with DOT-certified examiners and drug testing collection sites — manage everything online through your free employer portal.</p>
    <div class="grid-3">
      <div class="card">
        <h3>DOT Physical — ${city}</h3>
        <p>FMCSA-certified DOT physical exams for CDL drivers based in or near ${city}, ${stateName}. Medical Examiner Certificate issued on exam day.</p>
        <span class="price-tag">From $110</span>
      </div>
      <div class="card">
        <h3>Pre-Employment Drug Screen</h3>
        <p>5-panel and 10-panel urine drug screens for new hires in ${city}. Collection sites near ${city} — no appointment needed at most locations.</p>
        <span class="price-tag">From $80</span>
      </div>
      <div class="card">
        <h3>DOT Drug Testing — ${city}</h3>
        <p>DOT pre-employment, random, post-accident, and return to duty drug testing for ${city}-area CDL drivers and DOT-regulated employees.</p>
        <span class="price-tag">From $80</span>
      </div>
      <div class="card">
        <h3>DOT Consortium</h3>
        <p>Enroll your ${city} CDL drivers in an FMCSA-compliant random testing consortium. $49+/yr per driver with full compliance management.</p>
        <span class="price-tag">From $49/yr</span>
      </div>
      <div class="card">
        <h3>Pre-Employment Physical</h3>
        <p>Non-DOT pre-employment physicals for construction, healthcare, warehouse, and all industries in the ${city} area.</p>
        <span class="price-tag">From $110</span>
      </div>
      <div class="card">
        <h3>Return to Duty</h3>
        <p>DOT return to duty testing after SAP process and non-DOT fitness-for-duty evaluations for ${city} employees returning after injury or violation.</p>
        <a href="../return-to-duty" style="display:inline-block;margin-top:12px;font-size:18px;font-weight:600;color:#1e40af;text-decoration:none;">Learn more →</a>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8faff;">
  <div class="inner">
    <div class="label">How It Works</div>
    <h2 class="title">Order ${city} Occupational Health Services in 4 Steps</h2>
    <div class="how-grid">
      <div class="how-step">
        <div class="step-n">1</div>
        <h3>Create Employer Account</h3>
        <p>Sign up free at portal.dot-physical.net and set up your ${city}-area employees and testing program.</p>
      </div>
      <div class="how-step">
        <div class="step-n">2</div>
        <h3>Place an Order</h3>
        <p>Choose the service — DOT physical, drug screen, return to duty — and generate an employee authorization.</p>
      </div>
      <div class="how-step">
        <div class="step-n">3</div>
        <h3>Employee Goes to Site</h3>
        <p>Your employee takes the authorization to a Work OccMed-affiliated site near ${city}. No appointment needed at most locations.</p>
      </div>
      <div class="how-step">
        <div class="step-n">4</div>
        <h3>Results in 24–72 Hours</h3>
        <p>MRO-reviewed results delivered to your secure employer portal. Download or share instantly.</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-strip">
  <h2>Start Managing ${city} Occupational Health</h2>
  <p>Free employer account. No setup fees. Nationwide coverage including ${city}, ${stateName}.</p>
  <div class="cta-btns">
    <a href="https://portal.dot-physical.net/signup" class="cta-btn-primary">Create Free Account →</a>
    <a href="../states/${stateSlug}" class="cta-btn-outline">← All ${stateName} Cities</a>
    <a href="tel:+18882334567" class="cta-btn-outline">(888) 233-4567</a>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="f-brand-name">Work OccMed</div>
        <div class="f-brand-sub">A Doctors Place Company</div>
        <p class="f-brand-desc">Full-service occupational health for employers nationwide. DOT physicals, drug testing, OSHA screenings, and return to duty — all managed online.</p>
      </div>
      <div class="f-col">
        <h4>Services</h4>
        <a href="../#services">Pre-Employment Physical</a>
        <a href="../#services">DOT Physical Exam</a>
        <a href="../#services">Drug Testing</a>
        <a href="../return-to-duty">Return to Duty</a>
      </div>
      <div class="f-col">
        <h4>${stateName}</h4>
        <a href="../states/${stateSlug}">All ${stateName} Cities</a>
        <a href="https://portal.dot-physical.net/signup">Create Account</a>
        <a href="https://portal.dot-physical.net/join-consortium">DOT Consortium</a>
        <a href="../#coverage">All States</a>
      </div>
      <div class="f-col">
        <h4>Contact</h4>
        <a href="tel:+18882334567">(888) 233-4567</a>
        <a href="mailto:occmed@doctors-place.com">occmed@doctors-place.com</a>
        <a href="https://portal.dot-physical.net">Employer Portal</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="f-legal">© 2026 Work OccMed · A Doctors Place Company · Doctors Place Inc.</div>
      <div class="f-legal"><a href="https://portal.dot-physical.net/privacy">Privacy Policy</a> · <a href="../">Work OccMed Home</a></div>
    </div>
  </div>
</footer>
</body>
</html>`;
}

// Generate all files
const outDir = path.join(__dirname);
const statesDir = path.join(outDir, 'states');
const citiesDir = path.join(outDir, 'cities');

fs.mkdirSync(statesDir, { recursive: true });
fs.mkdirSync(citiesDir, { recursive: true });

let stateCount = 0;
let cityCount = 0;

for (const state of STATES) {
  // State page
  fs.writeFileSync(path.join(statesDir, `${state.slug}.html`), statePageHtml(state), 'utf8');
  stateCount++;

  // City pages
  for (const [cityIdx, city] of state.cities.entries()) {
    const citySlug = `${state.slug}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    fs.writeFileSync(path.join(citiesDir, `${citySlug}.html`), cityPageHtml(state, city, cityIdx), 'utf8');
    cityCount++;
  }
}

console.log(`Done. Generated ${stateCount} state pages and ${cityCount} city pages.`);
