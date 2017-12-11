import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import {Icon, Dropdown, Option} from 'coral-ui';
import EmptyCard from '../../../components/EmptyCard';
import t from 'coral-framework/services/i18n';
import LoadMore from '../../../components/LoadMore';
import PropTypes from 'prop-types';
import ActionsMenu from 'coral-admin/src/components/ActionsMenu';
import ActionsMenuItem from 'coral-admin/src/components/ActionsMenuItem';
import {isSuspended, isBanned} from 'coral-framework/utils/user';
import moment from 'moment';

const headers = [
  {
    title: t('community.username_and_email'),
    field: 'username'
  },
  {
    title: t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: t('community.status'),
    field: 'status'
  },
  {
    title: t('community.newsroom_role'),
    field: 'role'
  }
];

const getActionMenuLabel = (user) => {

  if (isBanned(user)) {
    return 'Banned';
  } else if (isSuspended(user)) {
    return 'Suspended';
  }

  return '';
};

const People = (props) => {
  const {
    onSearchChange,
    users = [],
    setUserRole,
    viewUserDetail,
    loadMore,
    unSuspendUser,
    unBanUser,
    showSuspendUserDialog,
    showBanUserDialog,
  } = props;

  const hasResults = !!users.nodes.length;

  return (
    <div className={cn(styles.container, 'talk-admin-community-people-container')}>
      <div className={styles.leftColumn}>
        <div className={styles.searchBox}>
          <Icon name='search' className={styles.searchIcon}/>
          <input
            id="commenters-search"
            type="text"
            className={styles.searchBoxInput}
            defaultValue=''
            onChange={onSearchChange}
            placeholder={t('streams.search')}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        {
          hasResults
            ? <div>
              <div>
                <table className={`mdl-data-table ${styles.dataTable}`}>
                  <thead>
                    <tr>
                      {headers.map((header, i) =>(
                        <th
                          key={i}
                          className={cn('mdl-data-table__cell--non-numeric', styles.header)}
                          scope="col" >
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.nodes.map((user, i)=> (
                      <tr key={i} className="talk-admin-community-people-row">
                        <td className="mdl-data-table__cell--non-numeric">
                          <button onClick={() => {viewUserDetail(user.id);}} className={cn(styles.username, styles.button)}>{user.username}</button>
                          <span className={styles.email}>{user.profiles.map(({id}) => id)}</span>
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                          {moment(new Date(user.created_at)).format('MMMM Do YYYY, h:mm:ss a')}
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                        
                          <ActionsMenu
                            icon="person"
                            className={cn(styles.actionsMenu, 'talk-admin-community-people-dd-status')}
                            buttonClassNames={cn(styles.actionsMenuButton, {
                              [styles.actionsMenuSuspended]: isSuspended(user),
                              [styles.actionsMenuBanned]: isBanned(user),
                            }, 'talk-admin-user-detail-actions-button')}
                            label={getActionMenuLabel(user)} >

                            {isSuspended(user) ? <ActionsMenuItem
                              onClick={() => unSuspendUser({id: user.id})}>
                              Remove Suspension
                            </ActionsMenuItem> : <ActionsMenuItem
                              onClick={() => showSuspendUserDialog({
                                userId: user.id,
                                username: user.username,
                              })}>
                              Suspend User
                            </ActionsMenuItem>}

                            {isBanned(user) ? <ActionsMenuItem
                              onClick={() => unBanUser({id: user.id})}>
                              Remove Ban
                            </ActionsMenuItem> : <ActionsMenuItem
                              onClick={() => showBanUserDialog({
                                userId: user.id,
                                username: user.username,
                              })}>
                              Ban User
                            </ActionsMenuItem>}

                          </ActionsMenu>
                        </td>
                        <td className="mdl-data-table__cell--non-numeric">
                          <Dropdown
                            containerClassName="talk-admin-community-people-dd-role"
                            value={user.role}
                            placeholder={t('community.role')}
                            onChange={(role) => setUserRole(user.id, role)}>
                            <Option value={'COMMENTER'} label={t('community.commenter')} />
                            <Option value={'STAFF'} label={t('community.staff')} />
                            <Option value={'MODERATOR'} label={t('community.moderator')} />
                            <Option value={'ADMIN'} label={t('community.admin')} />
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <LoadMore
                loadMore={loadMore}
                showLoadMore={users.hasNextPage}
              />
            </div>
            : <EmptyCard>{t('community.no_results')}</EmptyCard>
        }
      </div>
    </div>
  );
};

People.propTypes = {
  users: PropTypes.object.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  viewUserDetail: PropTypes.func.isRequired,
  unBanUser: PropTypes.func.isRequired,
  unSuspendUser: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func,
  showBanUserDialog: PropTypes.func,
  loadMore: PropTypes.func.isRequired,
};

export default People;
