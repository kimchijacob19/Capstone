import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const client = new pg.Client(process.env.DATABASE_URL);

async function seed() {
  try {
    await client.connect();

    // Clear existing data in FK order
    await client.query("DELETE FROM favorites");
    await client.query("DELETE FROM spots");
    await client.query("DELETE FROM cities");
    await client.query("DELETE FROM countries");
    await client.query("DELETE FROM continents");
    await client.query("DELETE FROM app_users");

    // Continents
    const { rows: continents } = await client.query(`
      INSERT INTO continents (name)
      VALUES 
        ('Europe'), 
        ('Asia'), 
        ('North America'),
        ('South America')
      RETURNING *;
    `);

    // Countires
    const { rows: countries } = await client.query(`
      INSERT INTO countries (continent_id, name)
      VALUES
        -- Europe
        (${continents[0].id}, 'Italy'),
        (${continents[0].id}, 'France'),
        (${continents[0].id}, 'Greece'),
        (${continents[0].id}, 'Spain'),
        (${continents[0].id}, 'Portugal'),
        (${continents[0].id}, 'Switzerland'),

        -- Asia
        (${continents[1].id}, 'South Korea'),
        (${continents[1].id}, 'Japan'),
        (${continents[1].id}, 'Taiwan'),
        (${continents[1].id}, 'Maldives'),
        (${continents[1].id}, 'Thailand'),

        -- North America
        (${continents[2].id}, 'USA'),
        (${continents[2].id}, 'Canada'),

        -- South America
        (${continents[3].id}, 'Bolivia'),
        (${continents[3].id}, 'Brazil'),
        (${continents[3].id}, 'Argentina'),
        (${continents[3].id}, 'Colombia'),
        (${continents[3].id}, 'Peru'),
        (${continents[3].id}, 'Chile')
      RETURNING *;
    `);

    // Cities
    const { rows: cities } = await client.query(`
      INSERT INTO cities (country_id, name)
      VALUES
        -- Italy
        (${countries[0].id}, 'Pisa'),
        (${countries[0].id}, 'Como'),
        (${countries[0].id}, 'Milan'),
        (${countries[0].id}, 'Venice'),

        -- France
        (${countries[1].id}, 'Paris'),

        -- Greece
        (${countries[2].id}, 'Santorini'),

        -- Spain
        (${countries[3].id}, 'Barcelona'),
        (${countries[3].id}, 'Bilbao'),

        -- Portugal
        (${countries[4].id}, 'Lagoa'),
        (${countries[4].id}, 'Sintra'),

        -- Switzerland
        (${countries[5].id}, 'Zürich'),
        (${countries[5].id}, 'Luzern'),
        (${countries[5].id}, 'Interlaken'),

        -- South Korea
        (${countries[6].id}, 'Seoul'),
        (${countries[6].id}, 'Pohang'),

        -- Japan
        (${countries[7].id}, 'Kyoto'),
        (${countries[7].id}, 'Osaka'),
        (${countries[7].id}, 'Sapporo'),

        -- Taiwan
        (${countries[8].id}, 'Taipei'),

        -- Maldives
        (${countries[9].id}, 'Any Island'),

        -- Thailand
        (${countries[10].id}, 'Chiang Mai'),
        (${countries[10].id}, 'Bangkok'),

        -- USA
        (${countries[11].id}, 'Brooklyn, NY'),
        (${countries[11].id}, 'Washington D.C.'),
        (${countries[11].id}, 'San Francisco, CA'),
        (${countries[11].id}, 'Chicago, IL'),
        (${countries[11].id}, 'Savannah, GA'),
        (${countries[11].id}, 'Philadelphia, PA'),

        -- Canada
        (${countries[12].id}, 'Québec City, QC'),
        (${countries[12].id}, 'Niagara Falls, ON'),
        (${countries[12].id}, 'North Vancouver, BC'),
        (${countries[12].id}, 'Peggy''s Cove, NS'),

        -- Bolivia
        (${countries[13].id}, 'Uyuni'),

        -- Brazil
        (${countries[14].id}, 'Rio de Janeiro'),

        -- Argentina
        (${countries[15].id}, 'Buenos Aires'),

        -- Colombia
        (${countries[16].id}, 'Santiago de Cali'),

        -- Peru
        (${countries[17].id}, 'Cusco'),

        -- Chile
        (${countries[18].id}, 'San Pedro de Atacama')
      RETURNING *;
    `);

    // Spots
    await client.query(`
      INSERT INTO spots (city_id, name, description, image_url, mode)
      VALUES
        -- Italy
        (${cities[0].id}, 'Torres di Pisa', 'Leaning Tower of Pisa.', 'https://example.com/pisa.jpg', 'day'),
        (${cities[1].id}, 'Villa Oleandra', 'Beautiful villa by Lake Como.', 'https://example.com/como.jpg', 'day'),
        (${cities[2].id}, 'San Siro Stadium', 'Historic football stadium with passionate fans.', 'https://example.com/sansiro.jpg', 'night'),
        (${cities[3].id}, 'San Polo', 'Venice metropolitan area with canals.', 'https://example.com/venice.jpg', 'day'),

        -- France
        (${cities[4].id}, 'Puente de Bir Hakeim', 'Bridge with Eiffel Tower backdrop.', 'https://example.com/birhakeim.jpg', 'night'),
        (${cities[4].id}, 'Tour Eiffel', 'Iconic Eiffel Tower landmark.', 'https://example.com/eiffel.jpg', 'both'),
        (${cities[4].id}, 'Moulin Rouge', 'Famous cabaret venue in Montmartre.', 'https://example.com/moulinrouge.jpg', 'both'),

        -- Greece
        (${cities[5].id}, 'Santorini Viewpoint', 'Iconic blue domes and ocean view.', 'https://example.com/santorini.jpg', 'day'),

        -- Spain
        (${cities[6].id}, 'Panoramic Bar', 'Stunning panoramic view near Barcelona.', 'https://example.com/barcelona.jpg', 'night'),
        (${cities[7].id}, 'Bilboko Donejakue Katedrala', '14th century Catholic cathedral.', 'https://example.com/bilbao.jpg', 'day'),

        -- Portugal
        (${cities[8].id}, 'Praia da Marinha', 'Golden cliffs and ocean scenery.', 'https://example.com/marinha.jpg', 'day'),
        (${cities[9].id}, 'Palácio Nacional da Pena', 'Romantic 19th century palace.', 'https://example.com/pena.jpg', 'day'),

        -- Switzerland
        (${cities[10].id}, 'Paradeplatz', 'Famous square in Zürich.', 'https://example.com/paradeplatz.jpg', 'night'),
        (${cities[11].id}, 'Rigi Kulm', 'Mountain peak train station view.', 'https://example.com/rigi.jpg', 'day'),
        (${cities[12].id}, 'Höhematte Park', 'Fireworks on Swiss National Day.', 'https://example.com/hohematte.jpg', 'night'),

        -- South Korea
        (${cities[13].id}, 'Gyeongbokgung Palace', 'Historic palace, traditional clothing experience.', 'https://example.com/gyeongbokgung.jpg', 'day'),
        (${cities[14].id}, 'Yeongildae Beach', 'On-the-water beach observatory pavilion.', 'https://example.com/yeongildae.jpg', 'night'),

        -- Japan
        (${cities[15].id}, 'Fushimi Inari Taisha', 'Iconic red torii gates in Kyoto.', 'https://example.com/inari.jpg', 'both'),
        (${cities[16].id}, 'Dotonbori', 'Vibrant nightlife district in Osaka.', 'https://example.com/dotonbori.jpg', 'both'),
        (${cities[17].id}, 'Odori Park', 'Famous park in Sapporo.', 'https://example.com/odori.jpg', 'both'),

        -- Taiwan
        (${cities[18].id}, 'Takemura Izakaya Alley', 'Historic streets with Taipei 101 backdrop.', 'https://example.com/taipei1.jpg', 'both'),
        (${cities[18].id}, 'Rainbow Six Crosswalk', 'Colorful rainbow crosswalk.', 'https://example.com/taipei2.jpg', 'day'),

        -- Maldives
        (${cities[19].id}, 'Island Resort', 'Any island paradise for wedding photos.', 'https://example.com/maldives.jpg', 'day'),

        -- Thailand
        (${cities[20].id}, 'Wat Chedi Luang', 'Historic Buddhist temple.', 'https://example.com/chedi.jpg', 'day'),
        (${cities[20].id}, 'Wiang Kum Kam', 'Ancient ruined city.', 'https://example.com/wiang.jpg', 'day'),
        (${cities[21].id}, 'Hong Sieng Kong Cafe', 'Cafe by Chao Phraya River.', 'https://example.com/cafe.jpg', 'both'),

        -- USA
        (${cities[22].id}, 'Dumbo', 'Brooklyn waterfront view of Manhattan.', 'https://example.com/dumbo.jpg', 'both'),
        (${cities[23].id}, 'National Mall', 'Iconic monuments and park in DC.', 'https://example.com/mall.jpg', 'day'),
        (${cities[24].id}, 'Golden Gate Bridge', 'Famous suspension bridge.', 'https://example.com/goldengate.jpg', 'both'),
        (${cities[25].id}, 'Cloud Gate', 'Chicago "Bean" sculpture.', 'https://example.com/cloudgate.jpg', 'day'),
        (${cities[26].id}, 'Forsyth Park', 'Beautiful park in Savannah.', 'https://example.com/forsyth.jpg', 'both'),
        (${cities[27].id}, 'Elfreth''s Alley', 'Historic street in Philadelphia.', 'https://example.com/elfreths.jpg', 'both'),

        -- Canada
        (${cities[28].id}, 'Parc du Bastion-de-la-Reine', 'Scenic park in Québec City.', 'https://example.com/quebec.jpg', 'both'),
        (${cities[29].id}, 'Niagara Falls', 'World-famous waterfall.', 'https://example.com/niagara.jpg', 'day'),
        (${cities[30].id}, 'Capilano Suspension Bridge Park', 'Suspension bridge in Vancouver forest.', 'https://example.com/capilano.jpg', 'day'),
        (${cities[31].id}, 'Peggy''s Cove Lighthouse', 'Iconic lighthouse on rocky coast.', 'https://example.com/peggyscove.jpg', 'day'),

        -- South America
        (${cities[32].id}, 'Uyuni Salt Flat', 'Vast reflective salt flats.', 'https://example.com/uyuni.jpg', 'day'),
        (${cities[33].id}, 'Cristo Redentor', 'Famous Christ the Redeemer statue.', 'https://example.com/cristo.jpg', 'day'),
        (${cities[34].id}, 'Cid Campeador', 'Monument in Buenos Aires.', 'https://example.com/campeador.jpg', 'day'),
        (${cities[35].id}, 'Mariposario', 'Butterfly sanctuary in Cali.', 'https://example.com/mariposario.jpg', 'day'),
        (${cities[36].id}, 'Sapantiana Aqueduct', 'Colonial aqueduct in Cusco.', 'https://example.com/aqueduct.jpg', 'day'),
        (${cities[37].id}, 'Iglesia San Pedro', 'Historic Catholic church in desert village.', 'https://example.com/sanpedro.jpg', 'day');
    `);

    console.log("🌱 Seed data inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await client.end();
  }
}

seed();
