import { type PropertyValues, type scheme } from "../types";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {

};

//schemeTable tiene una copia
export const fields = [
  { name: 'Text field', description: 'Simple short text', value: 'textField' },
  { name: 'Multiline', description: 'Text with multiple lines', value: 'multiline' },
  { name: 'Url', description: 'Text with URL validation', value: 'url' },
  { name: 'Group', description: 'Group of multiple fields', value: 'map' },
  { name: 'Repeat/List', description: 'A field that gets repeated multiple times (e.g. multiple text fields)', value: 'list' }
]

export const collections: Array<scheme> = [
  {
    id: 'pages',
    name: 'Pages',
    path: 'pages',
    description: 'List of website pages that can be edited here',
    icon: '',
    properties: {
      title: {
        datatype: 'string',
        name: 'Page Title',
        slug: 'Page_Title'
      },
      slug: {
        datatype: 'string',
        name: 'URL Slug',
        slug: 'URL_Slug'
      },
      hero_section: {
        name: 'Hero Section',
        slug: 'hero_section',
        datatype: 'map',
        properties: {
          headline: {
            datatype: 'string',
            name: 'Headline',
            slug: 'Headline'
          },
          background_image: {
            storage: {
              acceptedFiles: [
                'image/*',
              ],
              storagePath: 'page_hero/images',
            },
            datatype: 'string',
            name: 'Background Image',
            slug: 'background_image',
          },
          subhead: {
            datatype: 'string',
            name: 'Subheadline',
            slug: 'subhead'
          },
          call_to_action: {
            name: 'Call to Action',
            datatype: 'string',
            slug: 'call_to_action'
          },
          call_to_action_link: {
            datatype: 'string',
            name: 'CTA Link',
            url: 'true',
            slug: 'call_to_action_link'
          },
        },
      }
    }
  },
  {
    id: 'pages1',
    name: 'Pages1',
    path: 'pages1',
    description: 'List of website pages that can be edited here',
    icon: '',
    properties: {
      title: {
        datatype: 'string',
        name: 'Page Title',
        slug: 'Page_Title'
      },
      slug: {
        datatype: 'string',
        name: 'URL Slug',
        slug: 'URL_Slug'
      },
      hero_section: {
        name: 'Hero Section',
        slug: 'hero_section',
        datatype: 'map',
        properties: {
          headline: {
            datatype: 'string',
            name: 'Headline',
            slug: 'Headline'
          },
          background_image: {
            storage: {
              acceptedFiles: [
                'image/*',
              ],
              storagePath: 'page_hero/images',
            },
            datatype: 'string',
            name: 'Background Image',
            slug: 'background_image',
          },
          subhead: {
            datatype: 'string',
            name: 'Subheadline',
            slug: 'subhead'
          },
          call_to_action: {
            name: 'Call to Action',
            datatype: 'string',
            slug: 'call_to_action'
          },
          call_to_action_link: {
            datatype: 'string',
            name: 'CTA Link',
            url: 'true',
            slug: 'call_to_action_link'
          },
        },
      }
    }
  },
  {
    description: "",
    icon: "",
    id: "nueva_coleccion",
    name: "nueva coleccion",
    path: "nueva_coleccion",
    //view: "catalog",
    properties: {
      id: { name: "id", slug: "id", description: "", url: "", datatype: "textField", properties: {} },
      nombre: { name: "Nombre", slug: "nombre", description: "", url: "", datatype: "textField", properties: {} },
      path: { name: "path", slug: "path", description: "", url: "", datatype: "url", properties: {} },
      banner: {
        datatype: "map",
        description: "",
        name: "Banner",
        slug: "banner",
        url: "",
        properties: {
          titulo: { datatype: "textField", name: "Titulo", slug: "titulo" },
          slider: {
            datatype: "list",
            name: "Slider",
            slug: "slider",
            of: {
              datatype: "map",
              properties: {
                descripcion: { datatype: "textField", name: "Descripcion", slug: "descripcion" },
                imagen: { datatype: "url", name: "Imagen", slug: "imagen", url: "image" },
              }
            }
          }
        },
      }
    }
  }
]
export const contentNew = [
  {
    id: "prueba_21",
    nombre: "Prueba 21",
    path: "prueba_21",
    banner: {
      titulo: "titulo 21",
      slider: [
        {
          imagen: "imagen 1",
          descripcion: "desc 1"
        },
        {
          imagen: "imagen 2",
          descripcion: "desc 2"
        }
      ]
    }
  },
  {
    id: "prueba_1",
    nombre: "Prueba 1",
    path: "prueba_1",
    banner: {
      titulo: "titulo 1",
      slider: [
        {
          imagen: "imagen 1",
          descripcion: "desc 1"
        },
        {
          imagen: "imagen 2",
          descripcion: "desc 2"
        }
      ]
    }
  },
  {
    id: "prueba_3",
    nombre: "Prueba 3",
    path: "prueba_3",
    banner: {
      titulo: "titulo 3",
      slider: [
        {
          imagen: "imagen 1",
          descripcion: "desc 1"
        },
        {
          imagen: "imagen 2",
          descripcion: "desc 2"
        }
      ]
    }
  }
] as PropertyValues[]