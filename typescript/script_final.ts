(function () {

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
        participants: readonly { givenName: string, surname: string }[];
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
        room: string;
        participants: readonly string[];
        from: Date;
        till: Date;
    }

    interface NormalizedMeeting {
        type: Meeting['type'];
        title: string;
        link?: string;
        room?: string;
        participants: readonly string[];
        from: Date;
        till: Date;
        label: string;
        imageUrl: string;
    }

    type Meeting = WebexMeeting | SkypeMeeting | OnsiteMeeting | TeamsMeeting;

    let data: Meeting[] = [
        {
            type: 'webex',
            title: 'Standup',
            link: 'https://www.example.com',
            participants: ['Max Mustermann', 'Inge Beispiel'],
            from: new Date(2021, 8, 16, 9, 0, 0),
            till: new Date(2021, 8, 16, 9, 15, 0),
        },
        {
            type: 'skype',
            title: 'Kundentelko',
            link: 'https://www.example.com',
            participants: [
                { givenName: 'Annett', surname: 'Kundin' },
                { givenName: 'Inge', surname: 'Beispiel' }
            ],
            from: new Date(2021, 8, 16, 11, 0, 0),
            till: new Date(2021, 8, 16, 12, 0, 0),
        },
        {
            type: 'onsite',
            title: 'Mitarbeitergespräch',
            room: 'F112',
            participants: ['Christin Chefin'],
            from: new Date(2021, 8, 16, 15, 0, 0),
            till: new Date(2021, 8, 16, 17, 0, 0),
        }
    ];

    type MeetingTypes = Meeting['type'];
    type MeetingHelpUrls = Record<Exclude<MeetingTypes, 'onsite'>, string>;
    let helpUrls: MeetingHelpUrls = {
        webex: 'https://www.webex.com/',
        skype: 'https://www.skype.com/de/business',
        teams: 'https://teams.microsoft.com'
    };

    function normalizeMeeting(meeting: Meeting) : NormalizedMeeting {
        switch(meeting.type) {
            case 'onsite':
                return {
                    ...meeting,
                    link: undefined,
                    label: 'Vor Ort',
                    imageUrl: 'content/mms.png'
                };
        case 'skype':
            return {
                ...meeting,
                room: undefined,
                participants: meeting.participants.map(p => `${p.givenName} ${p.surname}`),
                label: 'Skype for Business',
                imageUrl: 'content/skype4business.png'
            };
        case 'webex':
            return {
                ...meeting,
                room: undefined,
                label: 'WebEx',
                imageUrl: 'content/webex.png'
            }
        case 'teams':
            return {
                ...meeting,
                room: undefined,
                label: 'Microsoft Teams',
                imageUrl: 'content/teams.png'
            }
        }
    }

    let getMeetingTime = (meeting: NormalizedMeeting) => {
        let fromString = meeting.from.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
        let tillString = meeting.till.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });

        return `${fromString} Uhr - ${tillString} Uhr`;
    }

    let getMeetingLink = (meeting: NormalizedMeeting) => {
        if (meeting.link == null) {
            return undefined;
        }
        let aElem = document.createElement('a');
        aElem.href = meeting.link;
        aElem.textContent = meeting.link;
        return aElem;
    }

    let getMeetingParticipants = (meeting: NormalizedMeeting) => {
        return meeting.participants.join(', ');
    }   

    let clearContainer = () => {
        const elem = document.getElementById('meeting-block-container');
        if (elem != null) {
            elem.innerHTML = '';
        };
    }

    /**
     * Render a detail block
     * @param {string} label 
     * @returns 
     */
    let renderMeetingDetail = (label: string, content: string | HTMLElement) => {
        let dlElem = document.createElement('dl');

        let dtElem = document.createElement('dt');
        dtElem.textContent = label;
        dlElem.appendChild(dtElem);

        let ddElem = document.createElement('dd');

        if (typeof content === 'string') {
            ddElem.textContent = content;
        } else {
            ddElem.appendChild(content);
        }
        dlElem.appendChild(ddElem);

        return dlElem;
    }

    let renderHelp = (meeting: NormalizedMeeting) => {
        if (meeting.type === 'onsite') {
            return undefined;
        }
        let aElem = document.createElement('a');
        aElem.textContent = '?';
        aElem.href = helpUrls[meeting.type];
        aElem.classList.add('help-link');
        aElem.setAttribute('target', '_blank');
        aElem.setAttribute('rel', 'noopener noreferer');
        return aElem;
    }

    let renderMeeting = (meeting: NormalizedMeeting) => {
        let blockElem = document.createElement('div');
        blockElem.classList.add('meeting-block');

        let imgElem = document.createElement('img');
        imgElem.src = meeting.imageUrl;
        blockElem.appendChild(imgElem);

        let headerElem = document.createElement('span');
        headerElem.classList.add('header');
        blockElem.appendChild(headerElem);

        let labelElem = document.createElement('span');
        labelElem.textContent = `${meeting.label}: `;
        headerElem.appendChild(labelElem);

        let titleElem = document.createElement('span');
        titleElem.textContent = meeting.title;
        headerElem.appendChild(titleElem);

        blockElem.appendChild(renderMeetingDetail('Uhrzeit:', getMeetingTime(meeting)));
        let linkElem = getMeetingLink(meeting);
        if (linkElem != undefined) {
            blockElem.appendChild(renderMeetingDetail('Einwahllink:', linkElem));
        }
        blockElem.appendChild(renderMeetingDetail('Teilnehmer:'.toLocaleLowerCase(), getMeetingParticipants(meeting)));

        let helpElem = renderHelp(meeting);
        if (helpElem != undefined) {
            blockElem.appendChild(helpElem);
        }

        return blockElem;
    }


    let appendToContainer = (element: HTMLElement) => {
        document.getElementById('meeting-block-container')?.appendChild(element);
    }

    let render = () => {
        clearContainer();

        data.forEach(meeting => {
            let meetingElement = renderMeeting(normalizeMeeting(meeting));
            appendToContainer(meetingElement);
        })

    }

    render();
})()