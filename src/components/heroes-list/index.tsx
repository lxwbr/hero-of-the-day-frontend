import React from 'react'
import SignOutButton from '../sign-out-button'
import CreateHeroModal from '../create-hero-modal'
import { PageHeader, List, Button } from 'antd'
import { Action } from 'redux'
import { thunkFetchHeroes } from '../../thunks'
import { connect } from 'react-redux'
import { AppState } from '../../store'
import { ThunkDispatch } from 'redux-thunk'
import { openCreateHeroModal, selectHero } from '../../store/heroes-list/actions'
import './HeroesList.css'
import { changeMembers } from '../../store/create-hero-modal/actions'

type Props = ExternalProps & DispatchProps & InternalProps

interface InternalProps {
  heroes: Array<{ name: string, members: string[] }>,
  pending: boolean,
  createHeroModalVisible: boolean
}

interface ExternalProps {
  userName?: string,
  userEmail?: string
}

interface DispatchProps {
  fetchHeroes: () => Promise<Action>
  selectHero: (hero: string) => void,
  openCreateHeroModal: (email?: string) => void
}

class HeroesList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.shouldComponentRender = this.shouldComponentRender.bind(this);
  }

  componentWillMount() {
    const { fetchHeroes } = this.props
    fetchHeroes()
  }

  shouldComponentRender() {
    const { pending } = this.props
    return !pending
  }

  render() {
    const { heroes, userEmail, userName, createHeroModalVisible } = this.props;

    if (!this.shouldComponentRender()) {
      return (
        <div className="main-container">
          <PageHeader
            className="site-page-header"
            title={userName ? `Hello, ${userName}!` : 'Heroes'}
            subTitle="Click on a hero handle to reveal the schedule"
            extra={
              <SignOutButton/>
            }
          />
          <div className="loading">Loading heroes...</div>
        </div>
      )
    } else {
      const sortedYourHeroes = heroes.filter(hero => hero.members.find(member => member === userEmail) != null).map(hero => hero.name)
      sortedYourHeroes.sort()
      const sortedAllHeroes = heroes.filter(hero => hero.members.find(member => member === userEmail) == null).map(hero => hero.name)
      sortedAllHeroes.sort()
      return (
        <div className="main-container">
          <PageHeader
            className="site-page-header"
            title={userName ? `Moin, ${userName}!` : 'Heroes'}
            subTitle="Click on a hero handle to reveal the schedule"
            extra={
              <div className="buttons-container">
                <Button type="primary" onClick={ async () => { this.props.openCreateHeroModal(userEmail) } }>Create Hero</Button>
                <SignOutButton/>
              </div>
            }
          />
          <div className="content">
            <div className="lists-container">
              <div className="hero-list">
                <div>Your heroes</div>
                <List
                  itemLayout="horizontal"
                  dataSource={sortedYourHeroes}
                  renderItem={item => (
                    <List.Item>
                      <div className="hero-label" onClick={() => this.props.selectHero(item)}>{item}</div>
                    </List.Item>
                  )}
                />
              </div>
              <div className="hero-list">
                <div>All heroes</div>
                <List
                  itemLayout="horizontal"
                  dataSource={sortedAllHeroes}
                  renderItem={item => (
                    <List.Item>
                      <div className="hero-label" onClick={() => this.props.selectHero(item)}>{item}</div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          {createHeroModalVisible ? <CreateHeroModal userEmail={userEmail}/> : <div/>}
        </div>
      )
    }    
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>): DispatchProps => ({
  fetchHeroes: () => dispatch(thunkFetchHeroes()),
  selectHero: (hero: string) => dispatch(selectHero(hero)),
  openCreateHeroModal: (email) => {
    dispatch(changeMembers(email))
    dispatch(openCreateHeroModal(true))
  }
})

const mapStateToProps = (state: AppState) => ({
  heroes: state.heroes.heroes,
  pending: state.heroes.pending,
  createHeroModalVisible: state.heroes.createHeroModalVisible
})

export default connect(mapStateToProps, mapDispatchToProps)(HeroesList)