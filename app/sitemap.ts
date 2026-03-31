import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://codeworld.codes'

  const routes: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '',            priority: 1.0, changeFreq: 'weekly'  },
    { path: '/tools',      priority: 0.9, changeFreq: 'weekly'  },
    { path: '/rf',         priority: 0.9, changeFreq: 'weekly'  },
    { path: '/forensics',  priority: 0.9, changeFreq: 'weekly'  },
    { path: '/mobile',     priority: 0.9, changeFreq: 'weekly'  },
    { path: '/network',    priority: 0.9, changeFreq: 'weekly'  },
    { path: '/pentest',    priority: 0.9, changeFreq: 'weekly'  },
    { path: '/malware',    priority: 0.8, changeFreq: 'monthly' },
    { path: '/osint',      priority: 0.8, changeFreq: 'monthly' },
    { path: '/email',      priority: 0.8, changeFreq: 'monthly' },
    { path: '/papers',     priority: 0.9, changeFreq: 'weekly'  },
    { path: '/research',   priority: 0.9, changeFreq: 'monthly' },
    { path: '/papers',     priority: 0.9, changeFreq: 'weekly'  },
    { path: '/playground', priority: 0.7, changeFreq: 'monthly' },
  ]

  return routes.map(({ path, priority, changeFreq }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }))
}
