const models = {
  event: {
    title: '',
    long: '',
    short: '',
    tags: [],
    start: moment().endOf('hour').add(1, 'ms').format('M/D/YYYY h:mm A'),
    end: moment().endOf('hour').add(1, 'h').add(1, 'ms').format('M/D/YYYY h:mm A'),
    tick_start: '', //for filtering & querying
    tick_end: '', //for filtering & querying
    // recurrenceStart: '',
    // recurrenceEnd: '',
    // recurrenceId: '',
    // recurrenceRule: '',
    // recurrenceException: '',
    // allDay: '',
    coordinator: '',
    instructor: '',
    fee: 0,
    age_group: 'All Ages',
    level: 'All Levels',
    slots: 0,
    allow_signup: false,
    cancel_allow: false,
    cancel_before: '',
    signup_open: '',
    signup_close: '',
    ntrp_max: 4.5,
    ntrp_min: 4.0,
    img: ''

  }
};
export { models };