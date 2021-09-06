
type webexMeeting = {
    title: string,
    link: string,
    participants: array<string>,
    from: Js.Date.t,
    till: Js.Date.t,
}

type skypeName =  {
    givenName: string,
    surname: string,
}

type skypeMeeting = {
    title: string,
    link: string,
    participants: array<skypeName>,
    from: Js.Date.t,
    till: Js.Date.t
}


type onsiteMeeting = {
    title: string,
    room: string,
    participants: array<string>,
    from: Js.Date.t,
    till: Js.Date.t,
}

type normalizedMeeting = {
    title: string,
    room: option<string>,
    link: option<string>,
    participants: array<string>,
    from: Js.Date.t,
    till: Js.Date.t,
    label: string,
    helpUrl: option<string>,
    imageUrl: string
}

type meeting = | WebexMeeting(webexMeeting) | SkypeMeeting(skypeMeeting) | OnsiteMeeting(onsiteMeeting);
/*let standup = {
   
}*/


let data:list<meeting> = list{
    WebexMeeting({
        title: "Standup",
        link: "https://www.example.com",
        participants: ["Max Mustermann", "Inge Beispiel"],
        from: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 9., ~minutes= 0.,~seconds= 0., ()),
        till: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 9., ~minutes= 15.,~seconds= 0., ()),
    }),
    SkypeMeeting({
        title: "Kundentelko",
        link: "https://www.example.com",
        participants: [
            { givenName: "Annett", surname: "Kundin" },
            { givenName: "Inge", surname: "Beispiel" }
        ],
        from: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 11., ~minutes= 0.,~seconds= 0., ()),
        till: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 12.,~minutes= 0.,~seconds= 0., ())
    }),
    OnsiteMeeting({
        title: "Mitarbeitergespräch",
        room: "F112",
        participants: ["Christin Chefin"],
        from: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 15., ~minutes= 0.,~seconds= 0., ()),
        till: Js.Date.makeWithYMDHMS(~year= 2021.,~month= 8.,~date= 16.,~hours= 17., ~minutes= 0.,~seconds= 0., ()),   
    })
}


type helpUrlsType ={
    webex: string,
    skype: string,
}
let helpUrls = {
    webex: "https://www.webex.com/",
    skype: "https://www.skype.com/de/business/"
}


let normalizeMeeting = (meeting) => {
    switch (meeting) {
        | WebexMeeting(s) => {
            let m: normalizedMeeting = {
                title: s.title,
                room: None,
                link: Some(s.link),
                participants: s.participants,
                label: "WebEx",
                imageUrl: "content/webex.png",
                helpUrl: Some(helpUrls.webex),
                from: s.from,
                till: s.till
            }
            m
        }
        | SkypeMeeting(s) => {
            ()
        }
        | OnsiteMeeting(s) => {
            ()
        }
    }
}

let getMeetingImageUrl = (meeting) => {
    switch (meeting) {
        | WebexMeeting(_) => "content/webex.png"
        | SkypeMeeting(_) => "content/skype4business.png"
        | OnsiteMeeting(_) => "content/mms.png"
    }
}

let getMeetingLabel = (meeting) => {
    switch (meeting) {
        | WebexMeeting(_) => "WebEx"
        | SkypeMeeting(_) => "Skype for Business"
        | OnsiteMeeting(_) => "Vor Ort"
    }
}

let getMeetingTime = (meeting: meeting) => {
    let from = switch(meeting) {
        | SkypeMeeting(m) => m.from
        | WebexMeeting(m) => m.from
        | OnsiteMeeting(m) => m.from
    }
    let till = switch(meeting) {
        | SkypeMeeting(m) => m.till
        | WebexMeeting(m) => m.till
        | OnsiteMeeting(m) => m.till
    }
    let fromString = Js.Date.toLocaleTimeString(from);
    let tillString = Js.Date.toLocaleTimeString(till);

    `${fromString} Uhr - ${tillString} Uhr`;
}

let getMeetingTitle = (meeting) => {
    switch(meeting) {
        | SkypeMeeting(m) => m.title
        | WebexMeeting(m) => m.title
        | OnsiteMeeting(m) => m.title
    }
}


let getMeetingParticipants = (meeting) => {
    let participants = switch(meeting) {
        | SkypeMeeting(m) => Js.Array.map(p => `${p.givenName} ${p.surname}`, m.participants)
        | WebexMeeting(m) => m.participants
        | OnsiteMeeting(m) => m.participants
    }

    Js.Array.joinWith(", ", participants)
}

let getMeetingLink = (meeting) => {
    let link = switch(meeting) {
        | SkypeMeeting(m) => m.link
        | WebexMeeting(m) => m.link
    }
    let aElem = Webapi.Dom.Document.createElement("a", Webapi.Dom.document);
    Webapi.Dom.Element.setAttribute("href", link, aElem);
    Webapi.Dom.Element.setTextContent(aElem, link);
    aElem
}

let clearContainer = () => {
    let container = Webapi.Dom.Document.getElementById("meeting-block-container", Webapi.Dom.document);
    switch(container) {
        | Some(c) => Webapi.Dom.Element.setInnerHTML(c, "");
        | None => ()
    }
}

type content = | StringContent(string) | ElementContent(Webapi.Dom.Element.t)

let renderMeetingDetail = (label, content) => {
    let dlElem = Webapi.Dom.Document.createElement("dl", Webapi.Dom.document);

    let dtElem = Webapi.Dom.Document.createElement("dt", Webapi.Dom.document);
    Webapi.Dom.Element.setTextContent(dtElem, label);
    Webapi.Dom.Element.appendChild(dtElem, dlElem);

    let ddElem = Webapi.Dom.Document.createElement("dd", Webapi.Dom.document);
    switch(content) {
        | StringContent(s) => Webapi.Dom.Element.setTextContent(ddElem, s)
        | ElementContent(e) => Webapi.Dom.Element.appendChild(e, ddElem)
    }    
    Webapi.Dom.Element.appendChild(ddElem, dlElem);
    dlElem
}


let renderHelp = (meeting) => {
    let href = switch(meeting) {
        | SkypeMeeting(_) => helpUrls.skype
        | WebexMeeting(_) => helpUrls.webex
    }
    let aElem = Webapi.Dom.Document.createElement("a", Webapi.Dom.document);
    Webapi.Dom.Element.setClassName(aElem, "help-link");
    Webapi.Dom.Element.setClassName(aElem, "help-link");
    Webapi.Dom.Element.setTextContent(aElem,"?");
    Webapi.Dom.Element.setAttribute("href", href, aElem);
    Webapi.Dom.Element.setAttribute("target", "_blank", aElem);
    Webapi.Dom.Element.setAttribute("rel", "noopener noreferer", aElem);
    aElem
}

let renderMeeting = (meeting) => {
    let blockElem = Webapi.Dom.Document.createElement("div", Webapi.Dom.document);
    Webapi.Dom.Element.setClassName(blockElem, "meeting-block");

    let imgElem = Webapi.Dom.Document.createElement("img", Webapi.Dom.document);
    Webapi.Dom.Element.setAttribute("src", getMeetingImageUrl(meeting), imgElem);
    Webapi.Dom.Element.appendChild(imgElem, blockElem);
    

    let headerElem = Webapi.Dom.Document.createElement("span", Webapi.Dom.document);
    Webapi.Dom.Element.setClassName(headerElem, "header");
    Webapi.Dom.Element.appendChild(headerElem, blockElem);

    let labelElem = Webapi.Dom.Document.createElement("span", Webapi.Dom.document);
    Webapi.Dom.Element.setTextContent(labelElem, `${getMeetingLabel(meeting)}: `);
    Webapi.Dom.Element.appendChild(labelElem, blockElem);

    let titleElem = Webapi.Dom.Document.createElement("span", Webapi.Dom.document);
    Webapi.Dom.Element.setTextContent(labelElem, getMeetingTitle(meeting));
    Webapi.Dom.Element.appendChild(titleElem, blockElem);

    Webapi.Dom.Element.appendChild(renderMeetingDetail("Uhrzeit:", StringContent(getMeetingTime(meeting))), blockElem);

    switch(meeting) {
        | OnsiteMeeting(m) => {
            Webapi.Dom.Element.appendChild(renderMeetingDetail("Raum:", StringContent(m.room)), blockElem);
        }
        | v => {
            Webapi.Dom.Element.appendChild(renderMeetingDetail("Einwahllink:", ElementContent(getMeetingLink(v))), blockElem)
        }
    }

    Webapi.Dom.Element.appendChild(renderMeetingDetail("Teilnehmer:", StringContent(getMeetingParticipants(meeting))), blockElem);

    switch(meeting) {
        | OnsiteMeeting(_) => ()
        | v => Webapi.Dom.Element.appendChild(renderHelp(v), blockElem);
    }

    blockElem
}

let appendToContainer = (element) => {
    let container = Webapi.Dom.Document.getElementById("meeting-block-container", Webapi.Dom.document);
    switch(container) {
        | Some(c) => Webapi.Dom.Element.appendChild(element,c);
        | None => ()
    }
}


let render = () => {
    clearContainer();

    Belt.List.forEach(data, meeting => {
        let meetingElement = renderMeeting(meeting);
        appendToContainer(meetingElement);
    });

}

render()