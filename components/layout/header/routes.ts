import { DOCTOR_ROLES } from '~/types/doctor.types';

type Route = {
  path: string;
  name: string;
  roles: number[];
};

export const HEADER_ROUTES: Route[] = [
  { name: 'Палаты и аналитика', path: '/', roles: [DOCTOR_ROLES.DOCTOR, DOCTOR_ROLES.SENIOR_DOCTOR] },
  { name: 'Пациенты', path: '/patients', roles: [DOCTOR_ROLES.DOCTOR, DOCTOR_ROLES.SENIOR_DOCTOR] },
  { name: 'Лечения и статистика', path: '/treatments', roles: [DOCTOR_ROLES.DOCTOR, DOCTOR_ROLES.SENIOR_DOCTOR] },
  { name: 'Больничные листы', path: '/medical-notes', roles: [DOCTOR_ROLES.DOCTOR, DOCTOR_ROLES.SENIOR_DOCTOR] },
  { name: 'Выписки', path: '/discharge-notes', roles: [DOCTOR_ROLES.DOCTOR, DOCTOR_ROLES.SENIOR_DOCTOR] },
  { name: 'Врачи', path: '/doctors', roles: [DOCTOR_ROLES.SENIOR_DOCTOR] },
];