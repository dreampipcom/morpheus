import { useContext, useEffect, useState } from 'react';
import { Hero, Posts } from '../components';
import Head from 'next/head'
import { AppContext } from '../context';
import Link from 'next/link';
import { getHeros, getHomeEpisodes, getHomePosts } from '../lib/api';
import { Template } from '../templates';
import { useRouter } from 'next/router';
import { localizeUrl } from '../lib/helpers';
import { ShowGrid } from '../components/ShowGrid';
import { HomeLocale } from '../locale/home';
import ReactPlayer from 'react-player';
import { addPlaceholders } from '../lib/server-helpers';
import Bugsnag from '@bugsnag/js';

const DEFAULT = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip plex the experience of happiness, investing crowdfunding and charity, connecting individuals and communities across the globe, in transactions that thrive to fulfil in nothing but happiness, by means of healthy competition.`
}

// Translation
const IT = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip amplifica l’esperienza della felicità, investendo in crowdfunding e beneficenza, connettendo individui e comunità di tutto il mondo, in transazioni che mirano a soddisfare solo la felicità, attraverso una sana competizione.`
};

const PT = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip amplifica a experiência da felicidade, investindo em crowdfunding e caridade, conectando indivíduos e comunidades ao redor do mundo, em transações que buscam nada além da felicidade, por meio de uma competição saudável.`
};

const ES = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip amplifica la experiencia de la felicidad, invirtiendo en crowdfunding y caridad, conectando individuos y comunidades en todo el mundo, en transacciones que buscan cumplir solo con la felicidad, a través de una competencia sana.`
};

const DE = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip verstärkt das Glückserlebnis, investiert in Crowdfunding und Wohltätigkeit und verbindet Menschen und Gemeinschaften auf der ganzen Welt in Transaktionen, die dazu dienen, ausschließlich Glück zu erfüllen, durch gesunden Wettbewerb.`
};

const FR = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip amplifie l’expérience du bonheur, investit dans le crowdfunding et la charité, connectant les individus et les communautés à travers le monde, dans des transactions qui s’efforcent de n’accomplir que le bonheur, au moyen d’une compétition saine.`
};

const RO = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip amplifică experiența fericirii, investind în finanțare participativă și caritate, conectând indivizii și comunitățile din întreaga lume, în tranzacții care tind să îndeplinească doar fericirea, prin intermediul unei competiții sănătoase.`
};

const PL = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip wzmacnia doświadczenie szczęścia, inwestując w crowdfundingu i działalność charytatywną, łącząc jednostki i społeczności na całym świecie, w transakcjach, które dążą do spełnienia jedynie szczęścia, poprzez zdrową konkurencję.`
};

const CZ = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip zesiluje zážitek štěstí investováním do crowdfunding a charity, spojující jednotlivce a komunity po celém světě, v transakcích, které usilují o naplnění pouze štěstím, prostřednictvím zdravé soutěže.`
};

const SE = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip förstärker upplevelsen av lycka genom investeringar i crowdfunding och välgörenhet, som förbinder individer och samhällen över hela världen, genom transaktioner som strävar efter att endast uppfylla lycka genom hälsosam konkurrens.`
};

const EE = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip võimendab õnne kogemust, investeerides rahakogumisse ja heategevusse, ühendades üksikisikuid ja kogukondi kogu maailmas tehingutes, mis püüavad täita vaid õnne, tervisliku konkurentsi kaudu.`
};

const JP = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPipは投資クラウドファンディングやチャリティを通じて幸福の経験を拡大し、世界中の個人やコミュニティをつなげ、純粋な幸福だけを追求する取引を行う健全な競争を通じて満足させることをめざしています。`
};

const RU = {
  title: 'DreamPip — Fintech for compassion. 📡',
  description: `DreamPip усиливает опыт счастья, инвестируя в краудфандинг и благотворительность, связывая людей и сообщества по всему миру в трансакциях, нацеленных лишь на счастье, через здоровое соперничество.`
};

const indexLocale = {
  ar: {
    title: 'DreamPip - التكنولوجيا المالية من أجل الرحمة.',
    description: `دريمبيب يعزز تجربة السعادة من خلال الاستثمار في التمويل التشاركي والأعمال الخيرية، ويربط بين الأفراد والمجتمعات في جميع أنحاء العالم، من خلال صفقات تهدف فقط إلى تحقيق السعادة، من خلال منافسة صحية.`
  },
  he: {
    title: 'דרים פיפ – טכנולוגיה פיננסית לרחמים.',
    description: `דרים פיפ מחזק את חוויית האושר, על ידי השקעה במימון המונים ובמעסיקות צדק, חוברת בין אנשים וקהילות מרחבי העולם, בעסקאות שמטרה רק להעשיר את האושר, דרך תחרות בריאה.`
  },
  zh: {
    title: '梦想片 — 充满同情心的金融科技。',
    description: `梦想片通过投资众筹和慈善事业来增强幸福体验，连接世界各地的个人和社区，促进只追求幸福的交易，并通过健康竞争实现。`
  },
  nl: {
    title: 'DreamPip — Fintech voor mededogen. 📡',
    description: `DreamPip versterkt de ervaring van geluk door te investeren in crowdfunding en liefdadigheid, en verbindt individuen en gemeenschappen over de hele wereld in transacties die alleen mikken op geluk, via gezonde competitie.`
  },
  da: {
    title: 'DreamPip — Fintech for medfølelse. 📡',
    description: `DreamPip forstærker glædens oplevelse ved at investere i crowdfunding og velgørenhed, og forbinder enkeltpersoner og samfund over hele verden i transaktioner, der kun sigter mod glæde via sund konkurrence.`
  },
  hu: {
    title: 'DreamPip — Pénzügyi technológia az együttérzésért. 📡',
    description: `A DreamPip erősíti a boldogság élményét, a közösségi finanszírozásba és a jótékonyságba történő befektetéssel, és összeköti az embereket és közösségeket világszerte, olyan tranzakciókat keresve, amelyek csak a boldogságot célozzák meg, egészséges versenyen keresztül.`
  },
  ca: {
    title: 'DreamPip — Fintech per la compassió. 📡',
    description: `DreamPip amplifica l'experiència de la felicitat invertint en finançament col·lectiu i caritat, connectant individus i comunitats d'arreu del món, en transaccions que tenen com a objectiu només la felicitat, a través d'una competició saludable.`
  },
  eu: {
    title: 'DreamPip — Finantza teknologia aintzindariarentzat. 📡',
    description: `DreamPip-ek zoriontasunaren esperientzia indartzen du, crowdfundingean eta ongintzan inbertituz, pertsonak eta munduko komunitateak konektatuz, zoriontasuna bakarrik helburu duen trantsakzioetan parte hartuz, lehiaketa osasungarri baten bidez.`
  },
  gl: {
    title: 'DreamPip — Fintech para a compaixão. 📡',
    description: `DreamPip amplía a experiencia da felicidade ao investir no financiamento colectivo e na caridade, conectando individuos e comunidades de todo o mundo en transaccións que teñen como obxectivo solo a felicidade, mediante unha competición sadia.`
  },
  sw: {
    title: 'DreamPip — Fintech kwa huruma. 📡',
    description: `DreamPip inaimarisha uzoefu wa furaha kwa kuwekeza katika kuchangisha fedha na hisani, kuunganisha watu binafsi na jamii duniani kote kwenye miamala inayolenga furaha tu, kupitia ushindani wa afya.`
  },
  hi: {
    title: 'ड्रीमपिप — दया के लिए फिनटेक। 📡',
    description: `ड्रीमपिप सहअनुभूति से धन प्रौद्योगिकी बढ़ाता है, क्रोडफंडिंग और परोपकार में निवेश करके, विश्व भर में व्यक्तियों और समुदायों को जोड़ता है, सिर्फ खुशी को ही लक्षित करने वाले सौदों में, स्वस्थ प्रतिस्पर्धा के माध्यम से.`
  },
  ms: {
    title: 'DreamPip — Fintech untuk belas kasihan. 📡',
    description: `DreamPip meningkatkan pengalaman kebahagiaan dengan melabur dalam krowdfunding dan amal, menghubungkan individu dan komuniti di seluruh dunia dalam urus niaga yang hanya bertujuan untuk kebahagiaan, melalui saingan yang sihat.`
  },
  bn: {
    title: 'ড্রিমপিপ — দয়ার জন্য ফিনটেক। 📡',
    description: `ড্রিমপিপ ক্রাউডফান্ডিং এবং দানে বিনিয়োগ করে, ধন প्रযোজননখা বৃদ্ধিত হিসেবে, সুস্থ প্রতিযোগিতার মাধ্যমে মাত্র খুশি নির্দিষ্ট মুটি করে বিশ্বব্যাপী ব্যক্তিদের মঞ্চা, যার লক্ষ্য খুশি।`
  },
  pa: {
    title: 'ਡ੍ਰੀਮਪਿਪ — ਦਯਾ ਲਈ ਫਿੰਟੈਕ। 📡',
    description: `ਡ੍ਰੀਮਪਿਪ ਦਾ ਵਿੱਚਾਰ ਖੁਸ਼ੀ ਦੀ ਅਨੁਭਵਣ ਨੂੰ ਤੇਜ਼ ਕਰਨ ਲਈ ਕਰੋੜਪੂਜੀ ਅਤੇ ਪੁੰਜੀ ਵੱਲ ਨਿਵੇਸ਼ ਕਰਕੇ, ਔਰਤਾ ਅਤੇ ਸਮੁੱਦਿਆਂ ਨੂੰ ਵਿਸ਼ਵਵਿੱਚ ਜੋੜਦਾ ਹੈ, ਇਕੋਨਾਤਮਯਕ ਪੜਦੀਆਂ ਵਿੱਚ ਸਿਰਫ ਫਿਕੀ ਨੂੰ ਲਕਲੀ, ਰਾਹੀਂ ਇੱਕ ਸਿਹਤ ਪ੍ਰਤਿਸਪਰਧਾ ਦੁਆਰਾ।`
  },
  tr: {
    title: 'DreamPip — Merhamet için Fintech. 📡',
    description: `DreamPip mutluluğu tecrübesini arttırarak, kalabalık fonlamaya ve hayır işlerine yatırım yaparak, sadece mutluluğu hedefleyen işlemleri teşvik ederek, sağlıklı rekabetle dünya genelinde bireyler ve toplulukları birleştirir.`
  },
  fi: {
    title: 'DreamPip — Fintech myötätunnolle. 📡',
    description: `DreamPip vahvistaa onnen kokemusta sijoittamalla joukkorahoitukseen ja hyväntekeväisyyteen, yhdistäen yksilöitä ja yhteisöjä ympäri maailmaa vain onnea tavoitteleviin kauppoihin terveen kilpailun kautta.`
  },
  el: {
    title: 'DreamPip — Fintech για συμπόνια. 📡',
    description: `Το DreamPip ενισχύει την εμπειρία της ευτυχίας επενδύοντας σε συλλογική χρηματοδότηση και φιλανθρωπία, συνδέοντας ατομικά άτομα και κοινότητες από όλο τον κόσμο σε συναλλαγές που στοχεύουν μόνο στην ευτυχία, μέσω υγιούς ανταγωνισμού.`
  },
  ko: {
    title: 'DreamPip - 동정심을 위한 핀테크. 📡',
    description: `DreamPip은 크라우드펀딩과 자선투자를 통해 행복 경험을 강화하며, 전 세계 개인 및 공동체를 연결하여 오직 행복을 추구하는 거래를 촉진하고 건강한 경쟁을 통해 행복을 실현합니다.`
  }
}

const AR = indexLocale.ar;
const HE = indexLocale.he;
const ZH = indexLocale.zh;
const NL = indexLocale.nl;
const DA = indexLocale.da;
const HU = indexLocale.hu;
const CA = indexLocale.ca;
const EU = indexLocale.eu;
const GL = indexLocale.gl;
const SW = indexLocale.sw;
const HI = indexLocale.hi;
const MS = indexLocale.ms;
const BN = indexLocale.bn;
const PA = indexLocale.pa;
const TR = indexLocale.tr;
const FI = indexLocale.fi;
const EL = indexLocale.el;
const KO = indexLocale.ko;



export default function Home(props) {
  const { posts: parsedPosts, hero: parsedHeros, episodes } = props;
  const [live, setLive] = useState()
  const [feed, setFeed] = useState(!!episodes?.length ? [...episodes].slice(0, 4) : [].slice(0, 4))
  const [isStreamingVideo, setIsStreamingVideo] = useState(false);
  const { consent } = useContext(AppContext);

  const checkLive = async () => {
    if (!consent) return
    try {
      const auth = `https://www.dreampip.com/api/checklive`;
      const token = await fetch(auth)
      const json = await token.json()
      const status = json.data?.status
      if (status === 'RUNNING') {
        setIsStreamingVideo(true)
      } else {
        setIsStreamingVideo(false)
      }
    } catch (e) {
      Bugsnag.notify(e)
    }
  }

  useEffect(() => {
    if(!consent) return
    checkLive()
  }, [consent])

  const { locale: orig, pathname } = useRouter()
  const locale = orig === "default" ? "en" : orig

  const localeMap = {
    "it-it": IT,
    "pt-br": PT,
    "en": DEFAULT,
    "es-es": ES,
    "de-de": DE,
    "fr-fr": FR,
    "ro": RO,
    "pl-pl": PL,
    "cs-cz": CZ,
    "et-ee": EE,
    "ja-jp": JP,
    "ru-ru": RU,
    "ar": AR,
    "he": HE,
    "zh": ZH,
    "nl": NL,
    "da": DA,
    "hu": HU,
    "ca": CA,
    "eu": EU,
    "gl": GL,
    "sw": SW,
    "hi": HI,
    "ms": MS,
    "bn": BN,
    "pa": PA,
    "tr": TR,
    "fi": FI,
    "el": EL,
    "ko": KO,
  }

  const meta = localeMap[locale] || localeMap['en']
  const localization = HomeLocale[locale] || HomeLocale['default']

  const url = `https://www.dreampip.com${orig !== 'default' ? `/${locale}` : '/'}`

  useEffect(() => {
    const parsed = episodes?.length && [...episodes].map((episode) => {
      const now = new Date()
      const episodeDate = new Date(episode?.date)


      if (now < episodeDate) {
        return
      }

      return episode
    }).filter((e) => e?.featured).sort((a, b) => {
      return new Date(b?.date) - new Date(a?.date)
    }).slice(0, 4)

    setFeed(parsed)
  }, [live])

  useEffect(() => {
    if(!consent) return
    const liveCheckInterval = setInterval(checkLive(), 60000 * 15);

    const countdown = () => {
      
      episodes?.length && [...episodes]?.map((episode) => {
        const countDownDate = new Date(episode?.date).getTime()
        const now = new Date().getTime()
        const end = new Date(episode?.end).getTime()

        if (now > countDownDate && now < end) {
          if (!live || live !== episode?.url) {
            setLive(episode?.url)
          }
        } else if (live && live === episode?.url) {
          setLive(undefined)
        }
      })
    }

    const interval = setInterval(countdown, 1000)
    return () => {
      clearInterval(interval)
      clearInterval(liveCheckInterval)
    }
  }, [consent])

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta property="og:title" content={meta.title} />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={meta.description} />
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.dreampip.com/`} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.dreampip.com/${locale}`} />
        })}
      </Head>
      <article className="content content-page">
        {parsedHeros?.length ? (
          <Hero
            title={parsedHeros?.title}
            bgImage={parsedHeros?.image?.url}
            buttonText={parsedHeros?.ctaText}
            buttonURL={parsedHeros?.ctaLink}
            isStreamingVideo={isStreamingVideo}
          >
            <p>{parsedHeros?.subTitle}</p>
          </Hero>
        ) : undefined}
        {isStreamingVideo && (
          <>
            <section
              style={{
                position: 'relative',
                width: '100%',
                zIndex: 2,
                backgroundColor: "#1a1a1a"
              }}>
              <ReactPlayer
                url="https://live.infra.dreampip.com/main.m3u8"
                controls={true}
                width="100%"
                height="auto"
                playsInline
              />
            </section>
          </>
        )}
        <section style={{ display: 'block', position: 'relative' }}>
          <ShowGrid even {...{ items: feed, locale, live, directory: '/episode' }} />
          {/* <Link href="/episodes"><span style={{ display: "block", textAlign: "center", margin: 32, width: "100%" }}>View all episodes</span></Link> */}
        </section>
        <section style={{ display: 'block', position: 'relative' }} className='wrap'>
          <Posts
            posts={parsedPosts}
            heading="Posts"
            headingLevel="h2"
            postTitleLevel="h3"
          />
          <Link href={localizeUrl("/blog", locale)}><span style={{ display: "block", textAlign: "center", margin: '32px 0', width: "100%" }}>{localization['view']}</span></Link>
        </section>
      </article>
    </div>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const data = await getHomeEpisodes(20, true)
  const hero = await getHeros(locale)
  const posts = await getHomePosts({ locale, limit: 6 })

  const newData = await addPlaceholders(data)
  const newPosts = await addPlaceholders(posts)
  const newHeroes = await addPlaceholders(hero)

  return {
    props: {
      preview,
      hero: newHeroes ?? null,
      posts: newPosts ?? null,
      episodes: newData ?? null,
    },
  }
}
export const maxDuration = 30;

Home.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}




