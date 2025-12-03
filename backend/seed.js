// Run: npm run seed
require('dotenv').config();
const connectDB = require('./config/db');
const Year = require('./models/Year');
const Subject = require('./models/Subject');

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // clear existing
    await Year.deleteMany({});
    await Subject.deleteMany({});

    const yearsData = [
      { title: 'First Year', slug: 'first-year', description: 'Introductory physics for first year.' },
      { title: 'Second Year', slug: 'second-year', description: 'Intermediate physics topics.' },
      { title: 'Third Year', slug: 'third-year', description: 'Advanced physics topics.' },
      { title: 'Fourth Year', slug: 'fourth-year', description: 'Specialized and elective physics.' }
    ];

    for (const y of yearsData) {
      const year = new Year({ title: y.title, slug: y.slug, description: y.description });
      await year.save();

      // add 3 example subjects for each year
      for (let i = 1; i <= 3; i++) {
        const subject = new Subject({
          title: `${y.title} - Subject ${i}`,
          content: `This is sample content for ${y.title} Subject ${i}.`,
          year: year._id
        });
        await subject.save();
        year.subjects.push(subject._id);
      }
      await year.save();
      console.log(`Seeded ${y.title}`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

seed();
