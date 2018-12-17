import React from 'react';

import Button from '../Button';
import Form from '../Form';
import Input from '../Input';

import {createRepertoir} from '../../api/client';
import useGlobalMap from '../../hooks/useGlobalMap';

import styles from './styles.scss';
import {setTokenCookie} from '../../helpers/user';
import {useGlobal} from "reactn";

function FormNewRepertoar() {
    const [, addRepertoire] = useGlobalMap('repertoires');
    const [, addNotification] = useGlobalMap('notifications');
    const [, setCurrentRepertoireId] = useGlobal('currentRepertoireId');


    async function handleOnSubmit(elements) {
        try {
            const {repertoire, token} = await createRepertoir(elements.get('title'));

            addRepertoire(repertoire._id, repertoire);
            setCurrentRepertoireId(repertoire._id);
            setTokenCookie(token);
        } catch (e) {
            addNotification(e.message, 'error');
        }
    }
    
    return (
        <div className={styles.wrapper}>
            <Form onSubmit={handleOnSubmit}>
                <Input name={'title'} label={'Název repertoáru'}/>
                <Button label={'Vytvořit'}/>
            </Form>
        </div>
    )
}

export default FormNewRepertoar;