import { createElement, type FunctionComponent } from "react"

const markdownConversion = (text: string) => {
    const arr = text.split("'")
    let marked: any[] = []
    arr.forEach((e, i) => {
        if (i % 2 === 0) {
            marked = [...marked, e]
        } else {
            marked = [...marked, <span key={`s-${i}`} className="text-focus">{e}</span>]
        }
    })

    return marked
}

const markdownConversion1 = (text: string) => {
    text = "<div>" + text + "</div>"
    const doc = new DOMParser().parseFromString(text, "text/xml");
    return doc.firstChild
}

const asyncComponent = (component: FunctionComponent<any>, data: any, trigger: boolean) => {
    if (trigger) {
        return createElement(component, { ...data })
    }
    else {
        return ""
    }
}
function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '_') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
}

export {
    markdownConversion,
    markdownConversion1,
    asyncComponent,
    slugify,
}