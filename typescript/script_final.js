"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function () {
    var data = [
        {
            type: 'webex',
            title: 'Standup',
            link: 'https://www.example.com',
            participants: ['Max Mustermann', 'Inge Beispiel'],
            from: new Date(2021, 8, 16, 9, 0, 0),
            till: new Date(2021, 8, 16, 9, 15, 0)
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
            till: new Date(2021, 8, 16, 12, 0, 0)
        },
        {
            type: 'onsite',
            title: 'Mitarbeitergespräch',
            room: 'F112',
            participants: ['Christin Chefin'],
            from: new Date(2021, 8, 16, 15, 0, 0),
            till: new Date(2021, 8, 16, 17, 0, 0)
        }
    ];
    var helpUrls = {
        webex: 'https://www.webex.com/',
        teams: 'https://www.microsoft.com/de-de/microsoft-teams/group-chat-software',
        skype: 'https://www.skype.com/de/business/'
    };
    function getMeetingImageUrl(meeting) {
        var type = meeting.type;
        switch (type) {
            case 'webex': return 'content/webex.png';
            case 'skype': return 'content/skype4business.png';
            case 'onsite': return 'content/mms.png';
            case 'teams': return 'content/teams.png';
            default: throw new UnsupportedValueError(type);
        }
    }
    function getMeetingLabel(meeting) {
        var type = meeting.type;
        switch (type) {
            case 'webex': return 'WebEx';
            case 'skype': return 'Skype for Business';
            case 'onsite': return 'Vor Ort';
            case 'teams': return 'Microsoft Teams';
            default: throw new UnsupportedValueError(type);
        }
    }
    function getMeetingTime(meeting) {
        var fromString = meeting.from.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
        var tillString = meeting.till.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
        return fromString + " Uhr - " + tillString + " Uhr";
    }
    function getMeetingLink(meeting) {
        var aElem = document.createElement('a');
        aElem.href = meeting.link;
        aElem.textContent = meeting.link;
        return aElem;
    }
    function getMeetingParticipants(meeting) {
        return meeting.participants.map(function (p) {
            if (typeof p === 'string') {
                return p;
            }
            if (isNameObject(p)) {
                return p.name;
            }
            return p.givenName + " " + p.surname;
        }).join(', ');
    }
    function isNameObject(obj) {
        return typeof obj === 'object' && typeof obj.name === 'string';
    }
    function isNameArray(nameArray) {
        return nameArray.length === 0 || typeof nameArray[0].name === 'string';
    }
    function render() {
        clearContainer();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var meeting = data_1[_i];
            var meetingElement = renderMeeting(meeting);
            appendToContainer(meetingElement);
        }
    }
    function clearContainer() {
        var container = document.getElementById('meeting-block-container');
        if (container != undefined) {
            container.innerHTML = '';
        }
    }
    function renderMeeting(meeting) {
        var blockElem = document.createElement('div');
        blockElem.classList.add('meeting-block');
        var imgElem = document.createElement('img');
        imgElem.src = getMeetingImageUrl(meeting);
        blockElem.appendChild(imgElem);
        var headerElem = document.createElement('span');
        headerElem.classList.add('header');
        blockElem.appendChild(headerElem);
        var labelElem = document.createElement('span');
        labelElem.textContent = getMeetingLabel(meeting) + ": ";
        headerElem.appendChild(labelElem);
        var titleElem = document.createElement('span');
        titleElem.textContent = meeting.title;
        headerElem.appendChild(titleElem);
        blockElem.appendChild(renderMeetingDetail('Uhrzeit:', getMeetingTime(meeting)));
        if (meeting.type === 'onsite') {
            blockElem.appendChild(renderMeetingDetail('Raum:', meeting.room));
        }
        else {
            blockElem.appendChild(renderMeetingDetail('Einwahllink:', getMeetingLink(meeting)));
        }
        blockElem.appendChild(renderMeetingDetail('Teilnehmer:', getMeetingParticipants(meeting)));
        var helpElem = renderHelp(meeting);
        if (helpElem != undefined) {
            blockElem.appendChild(helpElem);
        }
        return blockElem;
    }
    function renderMeetingDetail(label, content) {
        var dlElem = document.createElement('dl');
        var dtElem = document.createElement('dt');
        dtElem.textContent = label;
        dlElem.appendChild(dtElem);
        var ddElem = document.createElement('dd');
        if (typeof content === 'string') {
            ddElem.textContent = content;
        }
        else {
            ddElem.appendChild(content);
        }
        dlElem.appendChild(ddElem);
        return dlElem;
    }
    function renderHelp(meeting) {
        if (meeting.type === 'onsite') {
            return undefined;
        }
        var aElem = document.createElement('a');
        aElem.textContent = '?';
        aElem.href = helpUrls[meeting.type];
        aElem.classList.add('help-link');
        aElem.setAttribute('target', '_blank');
        aElem.setAttribute('rel', 'noopener noreferer');
        return aElem;
    }
    function appendToContainer(element) {
        var container = document.getElementById('meeting-block-container');
        if (container != undefined) {
            container.appendChild(element);
        }
    }
    var UnsupportedValueError = (function (_super) {
        __extends(UnsupportedValueError, _super);
        function UnsupportedValueError(value) {
            return _super.call(this, "This value is not supported: " + value) || this;
        }
        return UnsupportedValueError;
    }(Error));
    render();
})();
//# sourceMappingURL=script_final.js.map