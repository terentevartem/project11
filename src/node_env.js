export const NODE_ENV = process.env.NODE_ENV;
export let url;
if (NODE_ENV === 'production') {
    url = 'https://praktikum.tk/cohort1';
} else {
    url = 'http://praktikum.tk/cohort1';
}