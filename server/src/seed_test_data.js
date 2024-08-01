const fs = require('fs')
const axios = require('axios')
const path = require('path')
const Models = require('./database/models')

const { User, Image, Post, PostComment, PostLike, Follow } = Models
const { v4: uuidv4 } = require('uuid')
const logger = require('./utils/logger')
const { exit } = require('process')

const USER_COUNT = 10
const MAX_POSTS_PER_USER = 5
const MAX_COMMENTS_PER_USER = 20

const IMAGES_ROOT = path.join(__dirname, '../images')

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

function getRandomGps() {
  let u = Math.random()
  let v = Math.random()

  let latitude = Math.acos(u * 2 - 1) * (180 / Math.PI) - 90
  let longitude = 360 * v - 180
  return {
    latitude,
    longitude,
  }
}

var descriptions = [
  'A serene beach at sunset, with colorful hues painting the sky.',
  'A majestic mountain peak covered in a blanket of snow.',
  'A bustling cityscape, filled with towering skyscrapers and twinkling lights.',
  'An enchanting forest, with sunlight filtering through the tall trees.',
  'A tranquil lake surrounded by lush greenery and vibrant flowers.',
  'A charming street in a historic town, lined with quaint shops and cafes.',
  'A stunning natural waterfall cascading down moss-covered rocks.',
  'A panoramic view of a breathtaking canyon, with layers of red rocks.',
  'A rustic farmhouse nestled in the countryside, surrounded by fields of wildflowers.',
  'A close-up of a delicate butterfly perched on a vibrant flower.',
  'A dramatic sunset over a vast expanse of rolling hills.',
  'A magnificent palace with intricate architectural details.',
  'A lively marketplace, buzzing with activity and filled with colorful stalls.',
  'A picturesque vineyard, with rows of grapevines stretching into the distance.',
  'A vibrant street art mural, adding a pop of color to a city alleyway.',
  'A cascading waterfall plunging into a crystal-clear pool of water.',
  'A stunning rainbow spanning across the horizon after a rainstorm.',
  'A quaint lighthouse standing tall against a backdrop of crashing waves.',
  'A close-up of a rose petal, with dewdrops glistening in the morning light.',
  'A timeless cobblestone street lined with charming old houses.',
  'A striking desert landscape, with towering sand dunes as far as the eye can see.',
  'A vibrant coral reef teeming with colorful fish and marine life.',
  'A dramatic thunderstorm, with lightning illuminating the night sky.',
  'A peaceful countryside scene, with rolling meadows and grazing farm animals.',
  'A unique architectural masterpiece, with modern design and geometric shapes.',
  'A close-up of a delicate spiderweb adorned with morning dew.',
  'A picturesque waterfall surrounded by autumn foliage in vibrant shades of red and gold.',
  'A magical winter wonderland, with snow-covered trees and a frozen lake.',
  'A bustling Asian market, filled with exotic fruits and spices.',
  'A rugged coastal cliff, with waves crashing against the rocks below.',
  'A close-up of a quaint cabin with smoke gently rising from the chimney.',
  'A vibrant hot air balloon festival, filling the sky with a burst of colors.',
  'A peaceful garden adorned with blooming flowers and a tranquil pond.',
  'A mysterious fog enveloping an ancient forest, creating an eerie atmosphere.',
  'A panoramic view of a colorful autumn landscape, with trees in shades of orange and yellow.',
  'A row of traditional houses with unique architecture in a historic European city.',
  'A close-up of a graceful swan gliding across a calm lake.',
  'A bustling street market, with vendors selling fresh produce and handmade crafts.',
  'A majestic waterfall hidden in a lush jungle, surrounded by wildlife.',
  'A picturesque vineyard at golden hour, with the setting sun casting a warm glow.',
  'A quirky street art installation, adding an element of surprise to a city street.',
  'A tranquil morning scene, with mist rising from a peaceful lake.',
  'A vibrant fireworks display lighting up the night sky in a burst of colors.',
  'A traditional tea ceremony in a serene Japanese garden.',
  'A snow-covered alpine cabin tucked away in a peaceful snowy landscape.',
  'A stunning sunrise over a calm ocean, casting a warm golden light.',
  'A bustling bazaar in the heart of a Middle Eastern city, with colorful textiles and spices on display.',
  'A close-up of a blooming sunflower, with petals unfolding towards the sun.',
  'A lively street festival, with music, dancing, and vibrant costumes.',
  'A breathtaking natural arch formed by millennia of erosion in a rocky desert.',
  'A tranquil pagoda nestled among cherry blossom trees in full bloom.',
  'A panoramic view of a vibrant tulip field in the Netherlands during springtime.',
  'A charming cafe on a cobbled street, with tables spilling out onto the sidewalk.',
  'A mesmerizing starry night sky, with the Milky Way visible in all its glory.',
  'A bustling harbor, with fishing boats docked and seagulls soaring overhead.',
  'A close-up of a tiny ladybug crawling across a blade of grass.',
  'A stunning rainbow over a glistening waterfall, creating a magical scene.',
  'A charming windmill standing tall in the middle of a field of colorful flowers.',
  'A vibrant street market in Asia, filled with exotic fruits, spices, and lively chatter.',
  'A peaceful countryside cottage surrounded by blooming wildflowers.',
  'A towering skyscraper piercing through the clouds, a testament to human engineering.',
  'An ancient temple tucked away in a lush jungle, with stone carvings and intricate architecture.',
  'A close-up of a delicate dew-covered spiderweb, shimmering in the morning light.',
  'A picturesque coastal village, with colorful houses perched on cliffs overlooking the sea.',
  'A tranquil lake reflecting the stunning colors of a sunset sky.',
  'A bustling carnival with rides, games, and an atmosphere of excitement.',
  'A medieval castle bathed in golden sunlight, rising above a charming countryside.',
  'A close-up of a vibrant parrot, its feathers displaying an array of vivid colors.',
  'A breathtaking view of a snowy mountain range, stretching as far as the eye can see.',
  'A vibrant street market, with vendors selling exotic textiles, handicrafts, and spices.',
  'A peaceful garden filled with blooming cherry blossom trees.',
  'A mysterious mist rolling through an ancient forest, creating an ethereal atmosphere.',
  'A panoramic view of a sunflower field stretching towards the horizon.',
  'A row of colorful houses in a picturesque coastal town, with boats lining the harbor.',
  'A close-up of a delicate butterfly perched on a blooming flower.',
  'A lively street parade, with music, dance, and elaborate costumes.',
  'A breathtaking natural wonder, with a massive waterfall plunging into a deep gorge.',
  'A tranquil pagoda surrounded by a sea of blooming cherry blossom trees.',
  'A vibrant tulip field in full bloom, creating a colorful and picturesque scene.',
  'A cozy cafe nestled in a charming alleyway, with outdoor seating and colorful umbrellas.',
  'A mesmerizing display of the Northern Lights, painting the night sky with swirling colors.',
  'A bustling fish market, with fishermen unloading their catch of the day.',
  'A close-up of a delicate flower, its petals unfolding in intricate patterns.',
  'A stunning sunset over a picturesque beach, with waves gently lapping against the shore.',
  'A bustling night market, with food stalls, vendors, and a lively atmosphere.',
  'A medieval castle perched on a hilltop, offering panoramic views of the surrounding landscape.',
  'A close-up of a colorful peacock, its feathers displaying a delightful array of vibrant patterns.',
]

const comments = [
  'Wow, this image just took my breath away! The colors are so vibrant and the composition is perfect.',
  "I love how this image captures the essence of nature. It's so calming and peaceful.",
  'This image is a work of art! The attention to detail is amazing.',
  'Absolutely stunning! The lighting in this image is incredible.',
  "I can't stop staring at this image. It's like stepping into a dream.",
  'This image is so unique and thought-provoking. It tells a story.',
  'The creativity in this image is inspiring. I wish I had half the talent!',
  'This image has such a powerful message. It really makes you think.',
  "I'm in awe of the composition and perspective in this image.",
  'I wish I could teleport into this image. It looks like a magical place.',
  'Incredible shot! The timing and precision in capturing this moment is superb.',
  "I love how this image captures the beauty of everyday life. It's so ordinary yet extraordinary.",
  'This image is like a little slice of happiness. It brings a smile to my face.',
  "I'm amazed by the amount of detail in this image. It's like zooming into another world.",
  'This image is a true masterpiece. The depth and dimension are mind-boggling.',
  "I can't get over the vivid colors in this image. It's like looking at a rainbow.",
  'This image is so mesmerizing! I could stare at it for hours.',
  "I can feel the emotion in this image. It's so raw and powerful.",
  "Every element in this image is perfectly placed. It's visually stunning.",
  'This image captures the true essence of adventure. It makes me want to explore the world.',
  'The simplicity of this image is what makes it so beautiful. Less is truly more.',
  'I love how this image evokes a sense of nostalgia. It transports me back in time.',
  "This image is like a breath of fresh air. It's so refreshing and uplifting.",
  "The composition of this image is flawless. It's a visual treat for the eyes.",
  "This image speaks a thousand words. It's a silent storyteller.",
  "I'm in awe of the skill and patience required to capture such a stunning image.",
  "This image has a magical quality to it. It's like something out of a fairy tale.",
  "I can't get enough of this image. It's like a visual feast for the soul.",
  'The lighting in this image is so dramatic. It adds a whole new dimension to the scene.',
  'This image is proof that beauty can be found in the simplest things.',
  "I feel a sense of calm wash over me when I look at this image. It's so serene.",
  'This image is like a burst of sunshine. It brightens up my day!',
  "The details in this image are remarkable. It's like looking through a magnifying glass.",
  "I'm captivated by the mood of this image. It's so atmospheric and captivating.",
  'The use of colors in this image is genius. It creates a stunning visual impact.',
  "This image has a dreamy quality to it. It feels like I'm floating in a cloud.",
  "I can't help but smile when I see this image. It's contagious happiness.",
  'The contrast in this image is striking. It draws your attention instantly.',
  'This image is an escape from reality. It takes me to a different world.',
  "The composition in this image is flawless. It's like a perfectly choreographed dance.",
  "I'm envious of the skills required to capture this image. It's a true masterpiece.",
  "This image tells a story without using any words. It's truly captivating.",
  "I'm in awe of the simplicity and elegance in this image. It's pure perfection.",
  "This image transports me to another time and place. It's like a time machine.",
  "The symmetry in this image is so satisfying. It's visually pleasing.",
  "I can't get over the clarity and sharpness in this image. It's crystal clear.",
  "This image evokes a sense of wonder and curiosity. It's like a Pandora's box of beauty.",
  "The way this image plays with light and shadow is breathtaking. It's an art form.",
  "I feel a sense of serenity wash over me when I look at this image. It's so calming.",
  'This image captures the essence of pure joy. It makes me want to jump for happiness.',
  "The subject of this image is so captivating. It's impossible to look away.",
  "I'm amazed by the depth and perspective in this image. It's like looking into infinity.",
  "This image has a whimsical charm to it. It's like stepping into a fairy tale.",
  "I'm drawn to the texture in this image. It adds a whole new dimension to the scene.",
  "This image makes me appreciate the beauty of everyday things. It's a gentle reminder.",
  'The emotion captured in this image is palpable. It tugs at the heartstrings.',
  'I find the simplicity of this image so refreshing. Sometimes less is truly more.',
  "This image is a masterpiece of balance and harmony. It's visually soothing.",
  "I'm in awe of the colors in this image. They're so vibrant and alive.",
  'This image is a testament to the beauty of nature. It reminds us of our place in the world.',
  'The story behind this image is as intriguing as the image itself. It sparks curiosity.',
]

const bios = [
  'Coffee enthusiast ☕️ | Adventure seeker 🌍 | Music lover 🎶',
  'Bookworm 📚 | Nature lover 🌿 | Daydreamer 💭',
  'Foodie 🍔 | Traveller ✈️ | Pet lover 🐾',
  'Dreamer 💫 | Wanderlust ✨ | Yoga lover 🧘‍♀️',
  'Tech geek 🖥️ | Gamer 🎮 | Sci-fi fanatic 🚀',
  'Art lover 🎨 | Film geek 🎬 | Musician 🎸',
  'Fitness freak 💪 | Health conscious 🥦 | Dog mom 🐶',
  'Fashionista 👗 | Shopaholic 💸 | Selfie queen 📸',
  'Beach bum 🏖️ | Sun worshipper ☀️ | Cocktail connoisseur 🍹',
  'Sports fanatic ⚽️ | Team player 🏀 | Go-getter 💯',
  'Inspiration seeker ✨ | DIY enthusiast 🛠️ | Plant lover 🌱',
  'Animal rights activist 🐾 | Vegan 🌱 | Nature defender 🌿',
  'Movie buff 🎥 | Popcorn lover 🍿 | Film critic 🎞️',
  'Music festival junkie 🎵 | Concertgoer 🎶 | Party animal 🎉',
  'Fashion chameleon 👗 | Style icon 💃 | Trendsetter 👑',
  'Fitness junkie 💪 | Gym enthusiast 🏋️ | Marathon runner 🏃‍♀️',
  'Tech nerd 🤓 | Code monkey 🖥️ | Problem solver 💡',
  'Adventure awaits ✈️ | Thrill seeker 🌪️ | Life changer 🌟',
  'Fitness addict 💯 | Soccer mom ⚽️ | Smoothie lover 🥤',
  'Nature explorer 🌿 | Wildlife advocate 🐾 | Earth lover 🌎',
  'Film lover 🎞️ | Pop culture freak 📺 | Movie trivia expert 🍿',
  'Music junkie 🎶 | Festival hopper 🎸 | Dancing queen 💃',
  'Fashion lover 👠 | Style curator 🛍️ | Vintage enthusiast 👗',
  'Art enthusiast 🎨 | Design addict 🖌️ | Museum connoisseur 🏛️',
  'Food lover 🍕 | Cooking enthusiast 🍳 | Recipe experimenter 🧑‍🍳',
  'Fitness guru 💪 | Yoga addict 🧘‍♀️ | Meditation practitioner 🌼',
  'Gamer 🎮 | Geek 🤓 | Streamer 🕹️',
  'Dreamer 🌌 | Wanderer 🚶‍♀️ | Adventurer 🌍',
  'Passionate photographer who loves capturing fleeting moments.',
  'Nature enthusiast exploring the world one hike at a time.',
  'An avid reader on a never-ending quest for knowledge.',
  'Curious traveler with a passion for immersing in local cultures.',
  'Food lover exploring the culinary delights of every city.',
  'A dreamer striving to make a positive impact on the world.',
  'Art aficionado appreciating beauty in every brushstroke.',
  'Fitness enthusiast empowering others to prioritize their health.',
  'Fashion lover unleashing creativity through personal style.',
  'An adventurer seeking thrills and adrenaline rushes.',
  'Tech geek fascinated by the latest gadgets and innovations.',
  'Music lover with an endless playlist for every mood.',
  'Film enthusiast analyzing movies from a critical lens.',
  'Passionate advocate fighting for social and environmental causes.',
  'Sports fan cheering on favorite teams with unwavering loyalty.',
  'Creative soul with a love for crafting and DIY projects.',
  'Animal lover committed to the well-being of furry friends.',
  'Business-minded professional with an entrepreneurial spirit.',
  'Fitness fanatic motivating others to push their limits.',
  'Fashionista with an eye for trends and a passion for design.',
  'Bibliophile dedicated to spreading the love of books.',
  'Aspiring chef experimenting with flavors in the kitchen.',
  'Musician creating melodies that touch hearts and souls.',
  'Fitness coach guiding others on their journey to a healthier lifestyle.',
  'Art collector with an appreciation for diverse artistic expressions.',
  'Passionate environmentalist promoting sustainability.',
  'Theater enthusiast immersing in the magic of live performances.',
  'Food blogger exploring and sharing culinary experiences.',
  'Yoga practitioner finding balance and serenity on the mat.',
  'Technology enthusiast always staying ahead of the digital curve.',
]

function getRandomBio() {
  return bios[Math.floor(Math.random() * bios.length)]
}

function getRandomComment() {
  return comments[Math.floor(Math.random() * comments.length)]
}

function getRandomDescription() {
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

const downloadImage = (url, savePath) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(savePath))
          .on('finish', () => resolve())
          .on('error', (e) => reject(e))
      }),
  )

async function seedProfiles() {
  for (let i = 0; i < USER_COUNT; i++) {
    const user = (await (await fetch('https://randomuser.me/api/')).json()).results[0]
    const profileImageReference = '/profile/seeded_' + uuidv4().replace(/-/gi, '') + '.jpg'
    downloadImage(user.picture.medium, path.join(IMAGES_ROOT, profileImageReference))
    const userRow = await User.create({
      displayName: `${user.name.first} ${user.name.last}`,
      email: user.email,
      mention: user.login.username,
      bio: getRandomBio(),
      password: 'password',
      verified: true,
    })
    const profileImageRow = await Image.create({
      userId: userRow.id,
      reference: profileImageReference,
    })
    userRow.imageId = profileImageRow.id
    userRow.save()
    await sleep(1000)
  }
}

async function seedPosts() {
  // CREATE USER POSTS
  const userRows = await User.findAll({ raw: true })
  for (let i = 0; i < MAX_POSTS_PER_USER; i++) {
    userRows.forEach(async (userRow) => {
      const seed = uuidv4().replace(/-/gi, '')
      const postImageReference = '/post/seeded_' + seed + '.jpg'
      await downloadImage(`https://picsum.photos/seed/${seed}/1920/1080`, path.join(IMAGES_ROOT, postImageReference))
      fs.copyFileSync(
        path.join(IMAGES_ROOT, postImageReference),
        path.join(IMAGES_ROOT, '/thumb/120x120', postImageReference.split('/')[2]),
      )
      const postImageRow = await Image.create({
        userId: userRow.id,
        reference: postImageReference,
        ...getRandomGps(),
      })
      const postRow = await Post.create({
        userId: userRow.id,
        imageId: postImageRow.id,
        title: getRandomDescription(),
      })
      await sleep(1000)
    })
  }
}

async function seedComments() {
  const userRows = await User.findAll({ raw: true })
  const postRows = await Post.findAll({ raw: true })

  const limits = {}

  userRows.forEach((user) => {
    limits[user.id] = {
      max: Math.floor(Math.random() * MAX_COMMENTS_PER_USER) + 1,
      current: 0,
    }
  })

  let done = true
  do {
    for (let i = 0; i < userRows.length; i++) {
      const user = userRows[i]
      const limit = limits[user.id]
      if (limit.current === limit.max) {
        done = true
      } else {
        const randomPost = postRows[Math.floor(Math.random() * postRows.length)]
        const comment = await PostComment.create({
          body: getRandomComment(),
          userId: user.id,
          postId: randomPost.id,
        })
        limits[user.id].current = limit.current + 1
        done = false
      }
    }
  } while (!done)
}

async function seedLikes() {
  const userRows = await User.findAll()
  const postRows = await Post.findAll()

  for (let i = 0; i < userRows.length; i++) {
    const user = userRows[i]
    for (let j = 0; j < postRows.length; j++) {
      const randomPost = postRows[Math.floor(Math.random() * postRows.length)]
      await PostLike.findOrCreate({
        where: { userId: user.id, postId: randomPost.id },
        defaults: {
          userId: user.id,
          postId: randomPost.id,
        },
      })
    }
  }
}

async function seedFollows() {
  const userRows = await User.findAll()

  for (let i = 0; i < userRows.length; i++) {
    const user = userRows[i]
    const maxFollows = Math.floor(Math.random() * userRows.length)
    for (let j = 0; j < maxFollows; j++) {
      let randomUserToFollow
      do {
        randomUserToFollow = userRows[Math.floor(Math.random() * userRows.length)]
      } while (randomUserToFollow.id === user.id)

      await Follow.findOrCreate({
        where: { followingUserId: user.id, followedUserId: randomUserToFollow.id },
        defaults: {
          followingUserId: user.id,
          followedUserId: randomUserToFollow.id,
        },
      })
    }
  }
}

async function main() {
  try {
    logger.info('Beginning to seed test data, this may take a minute.')
    await sleep(5000)
    await seedProfiles()
    await sleep(4000)
    await seedPosts()
    await sleep(4000)
    await seedComments()
    await sleep(4000)
    await seedLikes()
    await sleep(4000)
    await seedFollows()
    logger.info('Seeding has completed successfully')
    logger.info('*************************************')
    logger.info('-- Log into any user with --')
    logger.info('email: first.last@example.com')
    logger.info('password: password')
    logger.info('*************************************')
  } catch (err) {
    logger.error(err)
  }
  exit(0)
}

main()
