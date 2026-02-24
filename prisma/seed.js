const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dervishirenovation.al';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash, role: 'ADMIN' } });
    console.log('✅ Admin user created:', email);
  } else {
    console.log('ℹ️ Admin user already exists:', email);
  }

  // Seed some initial prices
  const qa = await prisma.priceSetting.upsert({
    where: { key: 'qa_monthly' },
    update: { title: 'Online Q&A / Konsulta', description: 'Pagesë mujore manuale për pyetje dhe konsulta', priceLek: 2500 },
    create: { key: 'qa_monthly', title: 'Online Q&A / Konsulta', description: 'Pagesë mujore manuale për pyetje dhe konsulta', priceLek: 2500 }
  });

  // Seed a sample ebook
  await prisma.ebook.upsert({
    where: { slug: 'udhëzuesi-rinovimit' },
    update: {},
    create: {
      slug: 'udhëzuesi-rinovimit',
      title: 'Udhëzues praktik për rinovime',
      shortDesc: 'Hapat, materialet dhe gabimet që duhet të shmangni.',
      longDesc: 'Një ebook praktik me shembuj realë, lista kontrolli dhe këshilla nga terreni.',
      priceLek: 1500,
      coverImage: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&w=1600&q=80',
      previewMedia: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
      ],
      contentUrl: 'https://example.com/your-private-file.pdf'
    }
  });

  // Seed a couple of projects + testimonials
  const countProjects = await prisma.project.count();
  if (countProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Rikonstruksion apartamenti modern',
          location: 'Tiranë',
          description: 'Rifinitura premium, ndriçim i ri dhe kuzhinë moderne.',
          coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
          images: [
            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80'
          ]
        },
        {
          title: 'Banjë & kuzhinë – stil bashkëkohor',
          location: 'Durrës',
          description: 'Shtrim pllakash me precizion dhe pajisje moderne.',
          coverImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80',
          images: [
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80'
          ]
        }
      ]
    });
  }

  const countTestimonials = await prisma.testimonial.count();
  if (countTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: 'Ardit K.', role: 'Klient', quote: 'Punë shumë e rregullt dhe afate të respektuara. Super komunikim.' },
        { name: 'Elona M.', role: 'Kliente', quote: 'Rezultati final ishte mbi pritshmëritë. Detaje perfekte!' },
        { name: 'Bledi P.', role: 'Klient', quote: 'Profesionalizëm dhe transparencë gjatë gjithë procesit.' }
      ]
    });
  }

  console.log('✅ Seed done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
