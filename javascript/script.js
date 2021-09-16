// @ts-check

(function () {

    function add(a,b) {
        return a + b;
    }

    let add2 = (a,b) => {
        return a + b;
    }

    let data = [
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
            titel: 'Kundentelko',
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

    let helpUrls = {
        webex: 'https://www.webex.com/',
        skype: 'https://www.skype.com/de/business'
    };

    function normalizeMeeting(meeting) {
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
        }
    }

    let getMeetingTime = (meeting) => {
        let fromString = meeting.from.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
        let tillString = meeting.till.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });

        return `${fromString} Uhr - ${tillString} Uhr`;
    }

    let getMeetingLink = (meeting) => {
        let aElem = document.createElement('a');
        aElem.href = meeting.link;
        aElem.textContent = meeting.link;
        return aElem;
    }

    let getMeetingParticipants = (meeting) => {
        return meeting.participants.join(', ');
    }   

    let clearContainer = () => {
        document.getElementById('meeting-block-container').innerHTML = '';
    }

    /**
     * Render a detail block
     * @param {string} label 
     * @returns 
     */
    let renderMeetingDetail = (label, content) => {
        let dlElem = document.createElement('dl');

        let dtElem = document.createElement('dt');
        dtElem.textContent = label;
        dlElem.appendChild(dtElem);

        let ddElem = document.createElement('dd');

        ddElem.textContent = content;
        dlElem.appendChild(ddElem);

        return dlElem;
    }

    let renderHelp = (meeting) => {
        let aElem = document.createElement('a');
        aElem.textContent = '?';
        aElem.href = helpUrls[meeting.type];
        aElem.classList.add('help-link');
        aElem.setAttribute('target', '_blank');
        aElem.setAttribute('rel', 'noopener noreferer');
        return aElem;
    }

    let renderMeeting = (meeting) => {
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
        blockElem.appendChild(renderMeetingDetail('Einwahllink:', getMeetingLink(meeting)));
        blockElem.appendChild(renderMeetingDetail('Teilnehmer:', getMeetingParticipants(meeting)));

        blockElem.appendChild(renderHelp(meeting));

        return blockElem;
    }


    let appendToContainer = (element) => {
        document.getElementById('meeting-block-container').appendChild(element);
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