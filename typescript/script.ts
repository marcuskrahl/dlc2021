
interface WebexMeeting {
    type: 'webex';
    title: string;
    link: string;
    participants: readonly string[];
    from: Date;
    till: Date;
}


interface SkypeMeeting {
    type: 'skype';
    title: string;
    link: string;
    participants: readonly { givenName: string, surname: string}[];
    from: Date;
    till: Date;
}


interface OnsiteMeeting {
    type: 'onsite';
    title: string;
    room: string;
    participants: readonly string[];
    from: Date;
    till: Date;
}

interface TeamsMeeting {
    type: 'teams';
    title: string;
    link: string;
    participants: readonly { name: string}[];
    from: Date;
    till: Date;
}

type Meeting = WebexMeeting | SkypeMeeting | OnsiteMeeting | TeamsMeeting;

const data: readonly Meeting[] = [
    { 
        type: 'webex', 
        title: 'Standup', 
        link: 'https://www.example.com', 
        participants: ['Max Mustermann', 'Inge Beispiel'],
        from: new Date(2021,8, 16, 9, 0, 0),
        till: new Date(2021,8, 16, 10, 15, 0),
    },
    { 
        type: 'skype', 
        title: 'Kundentelko', 
        link: 'https://www.example.com', 
        participants: [ 
            { givenName: 'Annett', surname: 'Teilnehmerin'}, 
            { givenName: 'Inge', surname: 'Beispiel' }
        ],
        from: new Date(2021,8, 16, 11, 0, 0),
        till: new Date(2021,8, 16, 12, 0, 0),
    },
    { 
        type: 'onsite', 
        title: 'Mitarbeitergespräch', 
        room: 'F112', 
        participants: ['Christin Chefin'],
        from: new Date(2021,8, 16, 15, 0, 0),
        till: new Date(2021,8, 16, 17, 0, 0),
    }
] as const;

type MeetingTypes = Meeting['type'];
type MeetingHelpUrls = Record<Exclude<MeetingTypes, 'onsite'>, string>;

const helpUrls: MeetingHelpUrls = {
    webex: 'https://webex.example.com/help',
    teams: 'https://teams.example.com/help',
    skype: 'https://skype.example.com/help'
}


function getMeetingImageUrl(meeting: Meeting): string {
    const type = meeting.type;
    switch(type) {
        case 'webex': return 'content/webex.png';
        case 'skype': return 'content/skype4business.png';
        case 'onsite': return 'content/mms.png';
        case 'teams': return 'content/teams.png';
        default: throw new UnsupportedValueError(type);
    }
}

function getMeetingType(meeting: Meeting): string {
    const type = meeting.type;
    switch(type) {
        case 'webex': return 'WebEx';
        case 'skype': return 'Skype for Business';
        case 'onsite': return 'Vor Ort';
        case 'teams': return 'Microsoft Teams';
        default: throw new UnsupportedValueError(type);
    }
}

function getMeetingTime(meeting: Meeting): string {
    const fromString = meeting.from.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit'});
    const tillString = meeting.till.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit'});

    return `${fromString} Uhr - ${tillString} Uhr`;
}

function getMeetingLink(meeting: {link: string}): HTMLElement {
    const aElem = document.createElement('a');
    aElem.href = meeting.link;
    aElem.textContent = meeting.link;
    return aElem;
}

function getMeetingParticipants(meeting: Meeting): string {
    return meeting.participants.map(p => {
        if (typeof p === 'string') {
            return p;
        }
        if (isNameObject(p)) {
            return p.name;
        }
        return `${p.givenName} ${p.surname}`;
    }).join(', ');
}

function isNameObject(obj: unknown): obj is {name: string} {
    return typeof obj === 'object' && typeof (obj as {name?: unknown}).name === 'string';
}


function isNameArray(nameArray: readonly unknown[]): nameArray is readonly {name: string}[] {
    return nameArray.length  === 0 || typeof (nameArray[0] as {name: unknown}).name === 'string';
}

function render(): void {
    clearContainer();

    for(const meeting of data) {
        const meetingElement = renderMeeting(meeting);
        appendToContainer(meetingElement);
    }

}

function clearContainer(): void {
    const container = document.getElementById('meeting-block-container');
    if (container  != undefined) {
        container.innerHTML = '';
    }
}

function renderMeeting(meeting: Meeting): HTMLElement {
    const blockElem = document.createElement('div');
    blockElem.classList.add('meeting-block');

    const imgElem = document.createElement('img');
    imgElem.src = getMeetingImageUrl(meeting);
    blockElem.appendChild(imgElem);

    const headerElem = document.createElement('span');
    headerElem.classList.add('header');
    blockElem.appendChild(headerElem);

    const typeElem = document.createElement('span');
    typeElem.textContent = `${getMeetingType(meeting)}: `;
    headerElem.appendChild(typeElem);

    const titleElem = document.createElement('span');
    titleElem.textContent = meeting.title;
    headerElem.appendChild(titleElem);

    blockElem.appendChild(renderMeetingDetail('Uhrzeit:', getMeetingTime(meeting)));
    if (meeting.type === 'onsite') {
        blockElem.appendChild(renderMeetingDetail('Raum:', meeting.room));
    } else {
        blockElem.appendChild(renderMeetingDetail('Einwahllink:', getMeetingLink(meeting)));
    }
    blockElem.appendChild(renderMeetingDetail('Teilnehmer:', getMeetingParticipants(meeting)));

    const helpElem = renderHelp(meeting); 
    if (helpElem != undefined) {
        blockElem.appendChild(helpElem);
    }

    return blockElem;
}

function renderMeetingDetail(label: string, content: string | HTMLElement): HTMLElement {
    const dlElem = document.createElement('dl');

    const dtElem = document.createElement('dt');
    dtElem.textContent = label;
    dlElem.appendChild(dtElem);

    const ddElem = document.createElement('dd');

    if (typeof content === 'string') {
        ddElem.textContent = content;
    } else {
        ddElem.appendChild(content);
    }
    dlElem.appendChild(ddElem);

    return dlElem;
}

function renderHelp(meeting: Meeting): HTMLElement | undefined {
    if (meeting.type === 'onsite') {
        return undefined;
    }

    const aElem = document.createElement('a');
    aElem.textContent = '?';
    aElem.href = helpUrls[meeting.type];
    aElem.classList.add('help-link');
    aElem.setAttribute('target', '_blank');
    aElem.setAttribute('rel', 'noopener noreferer');
    return aElem;
}

function appendToContainer(element: HTMLElement): void {
    const container = document.getElementById('meeting-block-container');
    if (container != undefined) {
        container.appendChild(element);
    }
}

class UnsupportedValueError extends Error {
    constructor(value: never) {
        super(`This value is not supported: ${value}`)
    }
}

render();