// generate-sitemap.js — run: node generate-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.workoccmed.com';
const today = new Date().toISOString().split('T')[0];

const STATES = [
  { slug: 'alabama', cities: ['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa','Hoover','Dothan','Auburn','Decatur','Madison'] },
  { slug: 'alaska', cities: ['Anchorage','Fairbanks','Juneau','Sitka','Ketchikan','Wasilla','Kenai','Kodiak','Palmer','Bethel'] },
  { slug: 'arizona', cities: ['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Glendale','Gilbert','Tempe','Peoria','Surprise'] },
  { slug: 'arkansas', cities: ['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro','North Little Rock','Conway','Rogers','Bentonville','Pine Bluff'] },
  { slug: 'california', cities: ['Los Angeles','San Diego','San Jose','San Francisco','Fresno','Sacramento','Long Beach','Oakland','Bakersfield','Anaheim','Riverside','Stockton','Modesto','Chula Vista','Irvine'] },
  { slug: 'colorado', cities: ['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood','Thornton','Arvada','Westminster','Pueblo','Boulder'] },
  { slug: 'connecticut', cities: ['Bridgeport','New Haven','Hartford','Stamford','Waterbury','Norwalk','Danbury','New Britain','West Hartford','Greenwich'] },
  { slug: 'delaware', cities: ['Wilmington','Dover','Newark','Middletown','Smyrna','Milford','Seaford','Georgetown','Elsmere','New Castle'] },
  { slug: 'florida', cities: ['Jacksonville','Miami','Tampa','Orlando','St. Petersburg','Hialeah','Port St. Lucie','Tallahassee','Fort Lauderdale','Cape Coral','Pembroke Pines','Hollywood','Gainesville','Miramar','Coral Springs'] },
  { slug: 'georgia', cities: ['Atlanta','Augusta','Columbus','Macon','Savannah','Athens','Sandy Springs','Roswell','Johns Creek','Albany'] },
  { slug: 'hawaii', cities: ['Honolulu','Pearl City','Hilo','Kailua','Waipahu','Kaneohe','Mililani','Kahului','Ewa Beach','Kihei'] },
  { slug: 'idaho', cities: ['Boise','Meridian','Nampa','Idaho Falls','Pocatello','Caldwell',"Coeur d'Alene",'Twin Falls','Lewiston','Post Falls'] },
  { slug: 'illinois', cities: ['Chicago','Aurora','Naperville','Joliet','Rockford','Springfield','Elgin','Peoria','Champaign','Waukegan','Cicero','Bloomington','Decatur','Evanston','Schaumburg'] },
  { slug: 'indiana', cities: ['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel','Fishers','Bloomington','Hammond','Gary','Lafayette'] },
  { slug: 'iowa', cities: ['Des Moines','Cedar Rapids','Davenport','Sioux City','Iowa City','Waterloo','Council Bluffs','Ames','West Des Moines','Dubuque'] },
  { slug: 'kansas', cities: ['Wichita','Overland Park','Kansas City','Olathe','Topeka','Lawrence','Shawnee','Manhattan','Lenexa','Salina'] },
  { slug: 'kentucky', cities: ['Louisville','Lexington','Bowling Green','Owensboro','Covington','Richmond','Georgetown','Florence','Hopkinsville','Nicholasville'] },
  { slug: 'louisiana', cities: ['New Orleans','Baton Rouge','Shreveport','Metairie','Lafayette','Lake Charles','Kenner','Bossier City','Monroe','Alexandria'] },
  { slug: 'maine', cities: ['Portland','Lewiston','Bangor','South Portland','Auburn','Biddeford','Sanford','Augusta','Saco','Westbrook'] },
  { slug: 'maryland', cities: ['Baltimore','Frederick','Rockville','Gaithersburg','Bowie','Hagerstown','Annapolis','College Park','Salisbury','Laurel'] },
  { slug: 'massachusetts', cities: ['Boston','Worcester','Springfield','Cambridge','Lowell','Brockton','New Bedford','Quincy','Lynn','Fall River'] },
  { slug: 'michigan', cities: ['Detroit','Grand Rapids','Warren','Sterling Heights','Ann Arbor','Lansing','Flint','Dearborn','Livonia','Troy','Westland','Kalamazoo','Farmington Hills','Clinton Township','Canton'] },
  { slug: 'minnesota', cities: ['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington','Brooklyn Park','Plymouth','Maple Grove','Woodbury','St. Cloud'] },
  { slug: 'mississippi', cities: ['Jackson','Gulfport','Southaven','Hattiesburg','Biloxi','Meridian','Tupelo','Olive Branch','Greenville','Horn Lake'] },
  { slug: 'missouri', cities: ['Kansas City','St. Louis','Springfield','Columbia','Independence',"Lee's Summit","O'Fallon",'St. Joseph','St. Charles','Blue Springs'] },
  { slug: 'montana', cities: ['Billings','Missoula','Great Falls','Bozeman','Butte','Helena','Kalispell','Havre','Anaconda','Miles City'] },
  { slug: 'nebraska', cities: ['Omaha','Lincoln','Bellevue','Grand Island','Kearney','Fremont','Hastings','North Platte','Norfolk','Columbus'] },
  { slug: 'nevada', cities: ['Las Vegas','Henderson','Reno','North Las Vegas','Sparks','Carson City','Fernley','Elko','Mesquite','Boulder City'] },
  { slug: 'new-hampshire', cities: ['Manchester','Nashua','Concord','Derry','Dover','Rochester','Salem','Merrimack','Hudson','Bedford'] },
  { slug: 'new-jersey', cities: ['Newark','Jersey City','Paterson','Elizabeth','Trenton','Clifton','Camden','Passaic','Hackensack','Bayonne','East Orange','Vineland','Union City','Edison','Woodbridge'] },
  { slug: 'new-mexico', cities: ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe','Roswell','Farmington','Clovis','Hobbs','Alamogordo','Carlsbad'] },
  { slug: 'new-york', cities: ['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany','New Rochelle','Mount Vernon','Schenectady','Utica','White Plains','Brooklyn','Queens','Bronx','Staten Island'] },
  { slug: 'north-carolina', cities: ['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem','Fayetteville','Cary','Wilmington','High Point','Concord'] },
  { slug: 'north-dakota', cities: ['Fargo','Bismarck','Grand Forks','Minot','West Fargo','Williston','Dickinson','Mandan','Jamestown','Wahpeton'] },
  { slug: 'ohio', cities: ['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton','Parma','Canton','Youngstown','Lorain','Hamilton','Springfield','Kettering','Elyria','Lakewood'] },
  { slug: 'oklahoma', cities: ['Oklahoma City','Tulsa','Norman','Broken Arrow','Edmond','Lawton','Moore','Midwest City','Enid','Stillwater'] },
  { slug: 'oregon', cities: ['Portland','Eugene','Salem','Gresham','Hillsboro','Beaverton','Bend','Medford','Springfield','Corvallis'] },
  { slug: 'pennsylvania', cities: ['Philadelphia','Pittsburgh','Allentown','Erie','Reading','Scranton','Bethlehem','Lancaster','Harrisburg','Altoona','York','Wilkes-Barre','Chester','State College','Norristown'] },
  { slug: 'rhode-island', cities: ['Providence','Cranston','Warwick','Pawtucket','East Providence','Woonsocket','Coventry','North Providence','Cumberland','West Warwick'] },
  { slug: 'south-carolina', cities: ['Columbia','Charleston','North Charleston','Mount Pleasant','Rock Hill','Greenville','Summerville','Goose Creek','Hilton Head Island','Sumter'] },
  { slug: 'south-dakota', cities: ['Sioux Falls','Rapid City','Aberdeen','Brookings','Watertown','Mitchell','Yankton','Pierre','Huron','Vermillion'] },
  { slug: 'tennessee', cities: ['Nashville','Memphis','Knoxville','Chattanooga','Clarksville','Murfreesboro','Franklin','Jackson','Johnson City','Bartlett'] },
  { slug: 'texas', cities: ['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington','Corpus Christi','Plano','Lubbock','Laredo','Irving','Garland','Frisco','McKinney','Amarillo','Grand Prairie','Killeen','Beaumont','Midland'] },
  { slug: 'utah', cities: ['Salt Lake City','West Valley City','Provo','West Jordan','Orem','Sandy','Ogden','St. George','Layton','South Jordan'] },
  { slug: 'vermont', cities: ['Burlington','South Burlington','Rutland','Barre','Montpelier','Winooski','St. Albans','Newport','Vergennes','Middlebury'] },
  { slug: 'virginia', cities: ['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News','Alexandria','Hampton','Roanoke','Portsmouth','Suffolk'] },
  { slug: 'washington', cities: ['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Kent','Everett','Renton','Spokane Valley','Kirkland'] },
  { slug: 'west-virginia', cities: ['Charleston','Huntington','Morgantown','Parkersburg','Wheeling','Weirton','Fairmont','Martinsburg','Beckley','Clarksburg'] },
  { slug: 'wisconsin', cities: ['Milwaukee','Madison','Green Bay','Kenosha','Racine','Appleton','Waukesha','Eau Claire','Oshkosh','Janesville'] },
  { slug: 'wyoming', cities: ['Cheyenne','Casper','Laramie','Gillette','Rock Springs','Sheridan','Green River','Evanston','Riverton','Jackson'] },
];

function toSlug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function url(loc, priority, changefreq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const urls = [];

// Core pages
urls.push(url(`${BASE}/`, '1.0', 'weekly'));
urls.push(url(`${BASE}/partners`, '0.8', 'monthly'));
urls.push(url(`${BASE}/return-to-duty`, '0.8', 'monthly'));

// State pages
for (const state of STATES) {
  urls.push(url(`${BASE}/states/${state.slug}`, '0.7', 'monthly'));
  for (const city of state.cities) {
    const citySlug = `${state.slug}-${toSlug(city)}`;
    urls.push(url(`${BASE}/cities/${citySlug}`, '0.6', 'monthly'));
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log(`Sitemap written: ${urls.length} URLs`);
