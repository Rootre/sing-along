import React from 'react';
import classNames from 'classnames';

import PlusSVG from '../../static/svg/plus.svg';

import {deleteSection as deleteSectionAPI} from '../../api/client';
import useGlobalMap from '../../hooks/useGlobalMap';
import {setTokenCookie} from '../../helpers/user';

import styles from './styles.scss';

function Section({section, song}) {
    const [, setNotification] = useGlobalMap('notifications');
    const [, , deleteSection] = useGlobalMap('sections');

    async function handleDeleteSection() {
        if (!confirm(`Opravdu smazat sekci "${section.title}"?`)) {
            return;
        }

        try {
            const {token} = await deleteSectionAPI(section._id);

            deleteSection(section._id);
            setTokenCookie(token);
        } catch (e) {
            setNotification(e.message, 'error');
        }
    }

    return (
        <div className={styles.wrapper}>
            <h4>{section.title}: {song.title}</h4>
            <PlusSVG className={classNames(styles.removeIcon, 'removeSVG')} onClick={handleDeleteSection}/>
        </div>
    )
}

export default Section;