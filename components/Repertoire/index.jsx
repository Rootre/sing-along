import React, {useState} from 'react';
import {useGlobal} from 'reactn';
import classNames from 'classnames';

import CheckSVG from '../../static/svg/check.svg';
import PlusSVG from '../../static/svg/plus.svg';

import {deleteRepertoire as deleteRepertoireAPI, fetchSectionsInRepertoar, setActiveRepertoire} from '../../api/client';
import useGlobalMap from '../../hooks/useGlobalMap';
import {setTokenCookie} from '../../helpers/user';

import styles from './styles.scss';

function Repertoire({repertoire}) {
    const [fetching, setFetching] = useState(false);
    const [currentActiveRepertoireId, setCurrentActiveRepertoireId] = useGlobal('currentActiveRepertoireId');
    const [, setCurrentRepertoireId] = useGlobal('currentRepertoireId');
    const [, addNotification] = useGlobalMap('notifications');
    const [, , deleteRepertoire] = useGlobalMap('repertoires');
    const [, addSection] = useGlobalMap('sections');
    const [isMouseEnter, setIsMouseEnter] = useState(false);

    async function handleSetActive() {
        try {
            const {token} = await setActiveRepertoire(repertoire._id);

            setCurrentActiveRepertoireId(repertoire._id);
            setTokenCookie(token);
        } catch (e) {
            addNotification(e.message, 'error');
        }
    }
    async function handleSetCurrentRepertoar() {
        setFetching(true);
        setCurrentRepertoireId(repertoire._id);
        try {
            const {sections, token} = await fetchSectionsInRepertoar(repertoire._id);

            sections.forEach(section => addSection(section._id, section));
            setTokenCookie(token);
        } catch (e) {
            addNotification(e.message, 'error');
        } finally {
            setFetching(false);
        }
    }
    async function handleDeleteRepertoire() {
        if (!confirm(`Opravdu smazat repertoár "${repertoire.title}"?`)) {
            return;
        }

        try {
            const {token} = await deleteRepertoireAPI(repertoire._id);

            deleteRepertoire(repertoire._id);
            setTokenCookie(token);
        } catch (e) {
            addNotification(e.message, 'error');
        }
    }

    return (
        <div className={styles.wrapper}>
            <h4
                className={styles.title}
                onMouseEnter={() => setIsMouseEnter(true)}
                onMouseLeave={() => setIsMouseEnter(false)}
                title={'Zobrazit na hlavní stránce'}
            >
                <span onClick={handleSetCurrentRepertoar}>{repertoire.title}</span>
                {(isMouseEnter || currentActiveRepertoireId === repertoire._id) && (
                    <CheckSVG onClick={handleSetActive}/>
                )}
            </h4>
            <PlusSVG className={classNames(styles.removeIcon, 'removeSVG')} onClick={handleDeleteRepertoire}/>
        </div>
    )
}

export default Repertoire;