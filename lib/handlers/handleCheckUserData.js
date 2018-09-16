const client = require('../../index.js').client;
const idvariables = require('../../config/idvariables.json');

module.exports = function (type, params, user, mentions) {

    if (type === "citations") {
        if (params.length === 0) {
            return getCitations(user);
        } else if (params.length === 1) {
            if (!mentions.members.first()) return false;
            return getCitations(mentions.members.first());
        }
    }
    if (type == "citation") {
        if (params.length !== 1) return false;
        citationId = params[0];
        return getCitation(citationId);
    }

    if (type === "suspensions") {
        if (params.length === 0) {
            return getSuspensions(user);
        } else if (params.length === 1) {
            if (!mentions.members.first()) return false;
            return getSuspensions(mentions.members.first());
        }
    }
    if (type == "suspension") {
        if (params.length !== 1) return false;
        suspensionId = params[0];
        return getSuspension(suspensionId);
    }
    if (type === "approvals") {
        if (params.length === 0) {
            return getApprovalsRecieved(user);
        } else if (params.length === 1) {
            if (!mentions.members.first()) return false;
            return getApprovalsRecieved(mentions.members.first());
        }
    }
    if (type == "approval") {
        if (params.length !== 1) return false;
        approvalId = params[0];
        return getApproval(approvalId);
    }
    if (type === "atests") {
        if (params.length === 0) {
            return getATestsRecieved(user);
        } else if (params.length === 1) {
            if (!mentions.members.first()) return false;
            return getATestsRecieved(mentions.members.first());
        }
    }
    if (type == "atest") {
        if (params.length !== 1) return false;
        approvalId = params[0];
        return getATest(approvalId);
    }

    return false; //Not a correct type
}

function getCitations(user) {
    const server = client.guilds.get(idvariables.serverId)

    let embed = {
        color: 5175215,
        author: {
            name: user.displayName + "'s citations",
            icon_url: user.user.avatarURL
        },
        fields: []
    }
    const usersData = require('../../data/userData.json');
    const citationsData = require('../../data/citationData.json');
    if (user.id in usersData) userData = usersData[user.id]; else return user.displayName + " has no citations on record.";

    if ('citationsRecieved' in userData) {
        let citationCount = 0
        for (let citationId in userData['citationsRecieved']) {
            const citation = citationsData[citationId];
            if (!citation.void) citationCount++
            embed.fields.push({
                name: ((citation.void) ? '~~' : '') + "Citation " + citationId + ((citation.void) ? '~~' : ''),
                value: ((citation.void) ? '~~' : '***') + citation.reason + ((citation.void) ? '~~' : '***')
            });
        }
        embed['footer'] = {
            text: "Total Citations: " + citationCount
        };
        return { embed: embed };
    } else return user.displayName + " has no citations on record.";
}

function getCitation(citationId) {
    const citationsData = require('../../data/citationData.json');
    if (!(citationId in citationsData)) return "Citation not found."
    const citation = citationsData[citationId];
    let embed = {
        title: "Citation " + citationId + ((citation.void) ? ' [VOIDED]' : ''),
        color: 5175215,
        fields: [
            {
                name: "User Citated",
                value: "<@" + citation.userCitated + ">"
            },
            {
                name: "Citated by",
                value: "<@" + citation.citatedBy + ">"
            },
            {
                name: "Date/Time",
                value: (new Date(citation.time)).toString()
            },
            {
                name: "Reason",
                value: citation.reason
            }
        ]
    }

    if (citation.void) {
        embed.fields.push({
            name: "Voided by",
            value: "<@" + citation.voidedBy + ">"
        })
        embed.fields.push({
            name: "Voided on",
            value: (new Date(citation.voidedTime)).toString()
        })
    };
    return { embed: embed }
}

function getSuspensions(user) {
    const server = client.guilds.get(idvariables.serverId)

    let embed = {
        color: 5175215,
        author: {
            name: user.displayName + "'s suspensions",
            icon_url: user.user.avatarURL
        },
        fields: []
    }
    const usersData = require('../../data/userData.json');
    const suspensionsData = require('../../data/suspensionData.json');
    if (user.id in usersData) userData = usersData[user.id]; else return user.displayName + " has no suspensions on record.";

    if ('citationsRecieved' in userData) {
        let suspensionCount = 0
        for (let suspensionId in userData['suspensionsRecieved']) {
            const suspension = suspensionsData[suspensionId];
            suspensionCount++
            embed.fields.push({
                name: "Suspension " + suspensionId,
                value: suspension.reason
            });
        }
        embed['footer'] = {
            text: "Total Suspensions: " + suspensionCount
        };
        return { embed: embed };
    } else return user.displayName + " has no suspensions on record.";
}

function getSuspension(suspensionId) {
    const suspensionsData = require('../../data/suspensionData.json');
    if (!(suspensionId in suspensionsData)) return "Citation not found."
    const suspension = suspensionsData[suspensionId];
    let embed = {
        title: "Suspension " + suspensionId,
        color: 5175215,
        fields: [
            {
                name: "User Suspended",
                value: "<@" + suspension.suspendedUser + ">"
            },
            {
                name: "Rank at suspension",
                value: suspension.rankAtSuspension
            },
            {
                name: "Suspended by",
                value: "<@" + suspension.suspendedBy + ">"
            },
            {
                name: "Reason",
                value: suspension.reason
            },
            {
                name: "Start Date/Time",
                value: (new Date(suspension.startEpoch)).toString()
            },
            {
                name: "Scheduled Length",
                value: Math.round((suspension.scheduledEndEpoch - suspension.startEpoch) / 1000 / 60 / 60) + " hours"
            },
            {
                name: "Scheduled end Date/Time",
                value: (new Date(suspension.scheduledEndEpoch)).toString()
            },
            {
                name: "Actual end Date/Time",
                value: (new Date(suspension.actualEndEpoch)).toString()
            }

        ]
    }

    if (suspension.void) {
        embed.fields.push({
            name: "Voided by",
            value: "<@" + suspension.voidedBy + ">"
        })
        embed.fields.push({
            name: "Voided on",
            value: (new Date(suspension.voidedTime)).toString()
        })
    };
    return { embed: embed }
}

function getApprovalsRecieved(user) {
    const usersData = require('../../data/userData.json');
    const approvalData = require('../../data/approvalData.json');
    if (user.id in usersData) userData = usersData[user.id]; else return user.displayName + " has no data on record.";

    let embed = {
        color: 5175215,
        author: {
            name: user.displayName + "'s approvals",
            icon_url: user.user.avatarURL
        },
        fields: []
    };

    if ('approvalsRecieved' in userData) {
        let currentlyApproved = false;
        for (let approvalId in userData['approvalsRecieved']) {
            const approval = approvalData[approvalId];
            if (approval.open) currentlyApproved = true;
            embed.fields.push({
                name: "Approval " + approvalId + ((approval.open) ? '' : ' [CLOSED]'),
                value: "Approved by <@" + approval.approvedBy + ">"
            });
        }
        embed['footer'] = {
            text: "Current status: " + ((currentlyApproved) ? 'Approved' : 'Not Approved')
        }
        return { embed: embed };
    } else return user.displayName + " has no data on record.";

}

function getApproval(approvalId) {
    const approvalsData = require('../../data/approvalData.json');
    if (!(approvalId in approvalsData)) return "Approval not found."
    const approval = approvalsData[approvalId];
    let embed = {
        title: "Approval " + approvalId,
        color: 5175215,
        fields: [
            {
                name: "User Approved",
                value: "<@" + approval.userApproved + ">"
            },
            {
                name: "Approved by",
                value: "<@" + approval.approvedBy + ">"
            },
            {
                name: "Date/Time",
                value: (new Date(approval.time)).toString()
            },
            {
                name: "Active",
                value: (approval.open) ? 'Yes' : 'No'
            }
        ]
    }
    return { embed: embed }
}

function getATestsRecieved(user) {
    const usersData = require('../../data/userData.json');
    const aTestData = require('../../data/aTestData.json');
    if (user.id in usersData) userData = usersData[user.id]; else return user.displayName + " has no data on record.";

    let embed = {
        color: 5175215,
        author: {
            name: user.displayName + "'s Apprentice Tests",
            icon_url: user.user.avatarURL
        },
        fields: []
    };

    if ('aTestsRecieved' in userData) {
        for (let aTestId in userData['aTestsRecieved']) {
            const aTest = aTestData[aTestId];
            embed.fields.push({
                name: "Apprentice Test " + aTestId,
                value: "Tested by <@" + aTest.testedBy + ">"
            });
        }
        return { embed: embed };
    } else return user.displayName + " has no data on record.";

}

function getATest(aTestId) {
    const aTestsData = require('../../data/aTestData.json');
    if (!(aTestId in aTestsData)) return "Apprentice Test not found."
    const aTest = aTestsData[aTestId];
    let embed = {
        title: "Apprentice Test " + aTestId,
        color: 5175215,
        fields: [
            {
                name: "User Tested",
                value: "<@" + aTest.userTested + ">"
            },
            {
                name: "Tested by",
                value: "<@" + aTest.testedBy + ">"
            },
            {
                name: "Date/Time",
                value: (new Date(aTest.time)).toString()
            },
            {
                name: "Outcome",
                value: (aTest.outcome) ? 'Pass' : 'Fail'
            },
            {
                name: "Grammar Score",
                value: aTest.grammar,
                inline: true
            },
            {
                name: "Handbook Score",
                value: aTest.handbook,
                inline: true
            },
            {
                name: "Booth Score",
                value: aTest.booth,
                inline: true
            },
            {
                name: "Tester comments",
                value: aTest.comments,
            },
            {
                name: "Approval ID",
                value: aTest.approval,
            }
        ]
    };
    return { embed: embed }
}