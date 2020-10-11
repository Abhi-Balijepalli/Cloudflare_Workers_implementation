// Author: Abhi Balijepalli

var data = require('./links.json')
const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json;charset=UTF-8' },
    }
    const body = JSON.stringify({ data })
    return new Response(body, init)
}

async function handle_HTML_static(request) {

    const res = await fetch('https://static-links-page.signalnerve.workers.dev')
    const init = {
        headers: {'content-type': 'HTMLRewriter/Javascript;charset=UTF-8'}
    }

    // const value_extract = Object.values(parser)
    const linkRewriter = {
        element: (element) => {
            console.log(init)
            element.setAttribute('style','color:grey')
    
            element.append('<a href = "',{html:true})
            element.append(data[0].url)
            element.append('"> Linkedin </a>', {html:true})
            
            element.append('<a href = "',{html:true})
            element.append(data[1].url)
            element.append('"> Github </a>', {html:true})

            element.append('<a href = "',{html:true})
            element.append(data[2].url)
            element.append('"> Resume </a>', {html:true})
            
        }
    }
    const profileRewriter = {
        element: (element) => {
            element.setAttribute('style', '')
        }
    }
    const hRewriter = {
        element : (element) => {
            // element.setAttribute('text', "AbhiBalijepalli")
            element.setInnerContent("Abhi Balijepalli")
        }
    }

    const imgRewriter = {
        element: (element) => {
            // const img = fetch('https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2019/12/03202400/Yellow-Labrador-Retriever.jpg')
            // var img = require('./profile.png')
            element.setAttribute('src', 'https://i.pinimg.com/originals/c0/95/81/c09581d96ac318492c5df5ed20ac168a.jpg')

        }
    }
    const bodyColor = {
        element: (element) => {
            element.setAttribute('style', "background: #ff6c00")
        }
    }
    const rewriter = new HTMLRewriter()
        .on('h1#name', hRewriter)
        .on('div#links', linkRewriter)
        .on('img#avatar', imgRewriter)
        .on('div#profile', profileRewriter)
        .on('body', bodyColor)

    return rewriter.transform(res, init)
    
}
async function handleRequest(request) {
    const r = new Router()
    r.get('.*/links', request => handler(request))
    r.get('/', request =>handle_HTML_static(request))
   // r.get('/', () => new Response('hi, poopy')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
