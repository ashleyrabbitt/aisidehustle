export function parseDollarMax(value) {
    const matches = value.match(/\$?([\d,]+)/g) ?? [];
    const nums = matches.map((m)=>parseInt(m.replace(/[$,]/g, ''), 10)).filter((n)=>!isNaN(n));
    return nums.length ? Math.max(...nums) : 0;
}
export function timeToStartMaxDays(timeToStart) {
    const nums = (timeToStart.match(/\d+/g) ?? []).map(Number);
    const max = nums.length ? Math.max(...nums) : 0;
    if (/month/i.test(timeToStart)) return max * 30;
    if (/week/i.test(timeToStart)) return max * 7;
    return max;
}
function weeklyHoursRange(value) {
    const nums = (value.match(/\d+/g) ?? []).map(Number);
    if (!nums.length) return {
        min: 0,
        max: 0
    };
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const hasWeekUnit = /\bweek\b/i.test(value);
    const hasDayUnit = /\bday\b/i.test(value);
    if (/minute/i.test(value) && hasDayUnit) {
        return {
            min: min / 60 * 7,
            max: max / 60 * 7
        };
    }
    if (/hour/i.test(value) && hasDayUnit && !hasWeekUnit) {
        return {
            min: min * 7,
            max: max * 7
        };
    }
    if (!hasWeekUnit && !hasDayUnit) {
        return {
            min: 1,
            max: 2
        };
    }
    return {
        min,
        max
    };
}
export function parseWeeklyHoursMax(value) {
    return weeklyHoursRange(value).max;
}
export function parseWeeklyHoursMin(value) {
    return weeklyHoursRange(value).min;
}
export const WEEKLY_TIME_BUCKET_MAX_HOURS = {
    'under-5': 5,
    '5-10': 10,
    '10-20': 20,
    '20-plus': Infinity
};
export const BUDGET_BUCKET_MAX_DOLLARS = {
    'under-200': 200,
    '200-1000': 1000,
    '1000-plus': Infinity
};
function applyHustleQuizFilters(templates, params) {
    return templates.filter((hustle)=>{
        if (params.weeklyTime !== undefined) {
            if (parseWeeklyHoursMin(hustle.timeCommitment) > WEEKLY_TIME_BUCKET_MAX_HOURS[params.weeklyTime]) {
                return false;
            }
        }
        if (params.budget !== undefined) {
            if (parseDollarMax(hustle.startupCost) > BUDGET_BUCKET_MAX_DOLLARS[params.budget]) {
                return false;
            }
        }
        if (params.personality !== undefined) {
            if (!hustle.personalityTags?.includes(params.personality)) return false;
        }
        return true;
    });
}
export function filterHustlesForQuiz(templates, params) {
    const dropOrder = [
        'personality',
        'weeklyTime',
        'budget'
    ];
    let remaining = {
        ...params
    };
    let hustles = applyHustleQuizFilters(templates, remaining);
    const droppedFilters = [];
    for (const filterKey of dropOrder){
        if (hustles.length > 0) break;
        if (remaining[filterKey] === undefined) continue;
        remaining = {
            ...remaining,
            [filterKey]: undefined
        };
        droppedFilters.push(filterKey);
        hustles = applyHustleQuizFilters(templates, remaining);
    }
    return {
        hustles,
        droppedFilters
    };
}
export const STARTING_SKILLS = [
    {
        value: 'writing',
        label: 'Writing or content'
    },
    {
        value: 'design',
        label: 'Design or visual work'
    },
    {
        value: 'technology',
        label: 'Technology or coding'
    },
    {
        value: 'organizing',
        label: 'Organizing or operations'
    },
    {
        value: 'teaching',
        label: 'Teaching or coaching'
    },
    {
        value: 'sales',
        label: 'Sales or customer service'
    }
];
export const CUSTOMER_ACCESS = [
    {
        value: 'businesses',
        label: 'Business owners or colleagues'
    },
    {
        value: 'creators',
        label: 'Creators or an online audience'
    },
    {
        value: 'community',
        label: 'A local group or community'
    },
    {
        value: 'none',
        label: 'I need to find people first'
    }
];
const SKILLS = {
    writing: /writ|copy|content|edit|research/i,
    design: /design|visual|photo|video|creative/i,
    technology: /cod|program|develop|software|automat|technical/i,
    organizing: /organiz|operat|project|process|admin/i,
    teaching: /teach|coach|tutor|train|communicat/i,
    sales: /sales|customer|communicat|market|negotiat/i
};
const ACCESS = {
    businesses: /business|owner|entrepreneur|company|companies|professional|team|manager/i,
    creators: /creator|audience|influencer|author|podcast|content/i,
    community: /local|community|student|parent|family|families|neighbor/i
};
export function shortlistHustles(templates, answers) {
    const filtered = filterHustlesForQuiz(templates, answers);
    const picks = filtered.hustles.map((template, index)=>{
        const skill = answers.startingSkill && SKILLS[answers.startingSkill];
        const matches = skill ? template.skills.filter((s)=>skill.test(s)) : [];
        const customer = template.audience?.role ?? '';
        const access = answers.customerAccess && answers.customerAccess !== 'none' ? ACCESS[answers.customerAccess] : undefined;
        const possibleAccess = !!access?.test(customer);
        return {
            template,
            reason: matches.length ? `Uses ${matches.slice(0, 2).join(' and ')} from the template's skill list.` : 'A starting idea to compare; a fit with your existing skills is not confirmed.',
            question: possibleAccess ? `Could the people you can reach introduce you to ${customer}?` : `Where could you reach three ${customer || 'potential customers'} for a small test?`,
            score: Math.min(matches.length, 2) * 3 + (possibleAccess ? 2 : 0),
            index
        };
    }).sort((a, b)=>b.score - a.score || a.index - b.index).slice(0, 3);
    return {
        picks,
        droppedFilters: filtered.droppedFilters
    };
}
