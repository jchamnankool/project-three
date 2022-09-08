import React from 'react';
import styles from './createtopic.module.scss';

const CreateTopic = (props) => {
  return (props.trigger) ? ( 
    <div className={styles.createTopicPopup}>
      <div className={styles.createTopicPopupInner}>
        <button className={styles.closeButton} onClick={() => props.setTrigger(false)}>Close</button>
        {props.children}
      </div>
    </div>
  ) : '';
};

export default CreateTopic;
