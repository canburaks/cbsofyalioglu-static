// @ts-nocheck
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPosts } from '../../components/blog-posts'
import { WebmeisterLogo } from '../../components/Svg'
import { MetaTags } from '../../components'
import { site } from '../../settings'

const descriptionLong = `
Merhaba, Ben Can. Bir mühendis ve dijital ürünler geliştiren biriyim.
Bu yüzden zamanımın büyük çoğunluğu web üzerinde geçiyor. İlginç uygulamalar ve siteler biliyor, sürekli olarak da yenilerini keşfediyorum. Bunları da burada paylaşmaya çalışıyorum.
`

export default function Blog({ posts }) {
    //console.log("Blog posts: ", posts)
    const sortedPosts = posts.sort((a, b) => {
        const ad = new Date(a.frontMatter.date)
        const bd = new Date(b.frontMatter.date)
        return bd - ad
    })
    const canonical = "https://www.cbsofyalioglu.com/tr/"
    const title = "Design &amp; Development | Can Burak Sofyalıoğlu"
    const description = "Kişisel blog. Çoğunlukla web üzerine yazılar ve dijital araçlar."
    return (
        <div className="min-h-screen">
            <Head>
                <Head>
                    <title key="h-title-tag">Design &amp; Development | Can Burak Sofyalıoğlu</title>
                    <meta name="title" content={title} key="h-title" />
                    <meta name="description" content={description} key="h-description" />
                    <link rel="canonical" href={canonical} key="h-canonical" />
                    <MetaTags
                        type="website"
                        title={title}
                        description={description}
                        canonical={canonical}
                        cover={site.cover}
                    />
                </Head>
            </Head>
            <div className=" py-6 sm:py-8 lg:py-12">
                <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
                    {/* Text */}
                    <div className="mt-20 mb-10 md:mb-16">
                        <h2 className="text-gray-800 text-4xl lg:text-5xl font-bold text-center mb-4 md:mb-6">Blog</h2>

                        <p className="max-w-screen-md text-gray-500 md:text-lg text-center mx-auto">{descriptionLong}</p>
                    </div>

                    {/* Article */}
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4 md:gap-6 xl:gap-8">
                        {sortedPosts.map(post => (
                            <li
                                key={post.slug}
                                title={post.frontMatter.title}
                                className="group h-48 md:h-64 xl:h-64 flex flex-col  rounded-lg shadow-lg overflow-hidden relative"
                            >
                                <Image
                                    layout="fill"
                                    sizes="30vw"
                                    loading="lazy"
                                    src={post.frontMatter.thumbnail || post.frontMatter.cover || "/img/placeholder.webp"}
                                    alt={(post.frontMatter.keywords && post.frontMatter.keywords[0]) || post.frontMatter.title}
                                    className="w-full h-full object-cover object-center absolute inset-0 transform group-hover:scale-110 transition ease-out duration-500 z-0"
                                />

                                <div className="bg-gradient-to-t from-gray-800 md:via-transparent to-transparent absolute inset-0 pointer-events-none"></div>

                                <div className="relative p-4 mt-auto">
                                    <span className="block !text-gray-200 text-sm">{post.frontMatter.date}</span>
                                    <h2 className="!text-white text-xl font-semibold transition duration-100 mb-2 relative">
                                        <a
                                            title={post.frontMatter.title}
                                            href={`/${post.topic}/${post.slug}/`}
                                            className="group"
                                        >
                                            {post.frontMatter.title}
                                        </a>
                                    </h2>
                                    <p>{post.frontMatter.e}</p>
                                    <a className="!text-indigo-300 " href={`/${post.topic}`} title={`See ${post.topic} articles`}>{post.category}</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('posts'))
    const posts = files.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')
        const { data: frontMatter } = matter(markdownWithMeta)
        if (frontMatter.language && frontMatter.language.toLowerCase() === "tr") {
            //console.log("Turkish")
            return {
                frontMatter,

                // The slug will be user defined if exists in the frontmatter
                // Otherwise use default slug obtained from filename
                slug: frontMatter.slug || filename.split(".")[0],

                // If category exists use it,  otherwise use 'posts' directory
                topic: frontMatter.topic || "post"
            }
        }
    }).filter(Boolean)
    return {
        props: {
            posts
        }
    }
}

