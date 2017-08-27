/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  ListView,
  DrawerLayout,
  DrawerLayoutAndroid,
    Navigator,
    TouchableHighlight
} from 'react-native';

export default class ReactNative_AwesomeProject extends Component {
  render() {
      let pic = {
          uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
      };
    return (
      <View style={styles.container}>
        <Image source={pic} style={{width: 193, height: 110}}/>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <Text>Neuer toller Text!</Text>
        <Greeting name='Rexxar' />
        <Greeting name='Jaina' />
        <Greeting name='Valeera' />
        <Blink style={styles.red} text='I love to blink' />
        <Blink style={styles.bigblue} text='Yes blinking is so great' />
        <Blink style={[styles.bigblue, styles.red]} text='Why did they ever take this out of HTML' />
        <Blink style={styles.red} text='Look at me look at me look at me' />
        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
        <View style={{width: 150, height: 150, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
}

class Greeting extends Component {
    render() {
        return (
            <Text>Hello {this.props.name}!</Text>
        );
    }
}

class Blink extends Component {
    constructor(props) {
        super(props);
        this.state = {showText: true};

        // Toggle the state every second
        setInterval(() => {
            this.setState({ showText: !this.state.showText });
        }, 1000);
    }

    render() {
        let display = this.state.showText ? this.props.text : ' ';
        return (
            <Text>{display}</Text>
        );
    }
}

class FlexDimensionsBasics extends Component {
    render() {
        return (
            // Try removing the `flex: 1` on the parent View.
            // The parent will not have dimensions, so the children can't expand.
            // What if you add `height: 300` instead of `flex: 1`?
            <View style={{flex: 1}}>
              <View style={{flex: 1, backgroundColor: 'powderblue'}} />
              <View style={{flex: 2, backgroundColor: 'skyblue'}} />
              <View style={{flex: 3, backgroundColor: 'steelblue'}} />
            </View>
        );
    }
};

class FlexDirectionBasics extends Component {
    render() {
        return (
            // Try setting `flexDirection` to `column`.
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
              <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
              <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
            </View>
        );
    }
};

class JustifyContentBasics extends Component {
    render() {
        return (
            // Try setting `justifyContent` to `center`.
            // Try setting `flexDirection` to `row`.
            <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
              <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
              <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
              <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
            </View>
        );
    }
};

class PizzaTranslator extends Component {
    static get defaultProps() {
        return {
            title: 'PizzaScene'
        };
    }

    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    render() {
        return (
            <View style={{padding: 10}}>
              <TextInput
                  style={{height: 40}}
                  placeholder="Type here to translate!"
                  onChangeText={(text) => this.setState({text})}
              />
              <Text style={{padding: 10, fontSize: 42}}>
                  {this.state.text.split(' ').map((word) => (word + '🍕') ).join(' ')}
              </Text>
            </View>
        );
    }
}

class IScrolledDownAndWhatHappenedNextShockedMe extends Component {
    /*render() {
        return(
            <ScrollView>
              <Text style={{fontSize:96}}>Scroll me plz</Text>
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Text style={{fontSize:96}}>If you like</Text>
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Text style={{fontSize:96}}>Scrolling down</Text>
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Image source={require('./img/favicon.png')} />
              <Text style={{fontSize:96}}>What's the best</Text>
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Text style={{fontSize:96}}>Framework around?</Text>
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Image source={require('./img/favicon.png')} />
                <Text style={{fontSize:80}}>React Native</Text>
            </ScrollView>
        );
    }*/
}

class Drawer extends Component {

    /*static get defaultProps() {
        return {
            title: 'MyScene'
        };
    }*/

    render() {
        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I am the Drawer!</Text>
                <TouchableHighlight onPress={this.props.onPush}>
                    <Text>Tap me to load the next scene</Text>
                </TouchableHighlight>
            </View>
        );
        let pic = {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
        };
        return (

            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <ScrollView>
                    <View style={styles.container}>
                        <Image source={pic} style={{width: 193, height: 110}}/>
                        <Text style={styles.instructions}>
                            Zieh mal links um das Side Menu zu öffnen
                        </Text>
                        <Text>Current Scene: {this.props.title}</Text>
                        <Text style={styles.welcome}>
                            Welcome to React Native!
                        </Text>
                        <Text style={styles.instructions}>
                            To get started, edit index.android.js
                        </Text>
                        <Text style={styles.instructions}>
                            Double tap R on your keyboard to reload,{'\n'}
                            Shake or press menu button for dev menu
                        </Text>
                        <Text>Neuer toller Text!</Text>
                        <Greeting name='Rexxar' />
                        <Greeting name='Jaina' />
                        <Greeting name='Valeera' />
                        <Blink text='I love to blink' />
                        <Blink text='Yes blinking is so great' />
                        <Blink text='Why did they ever take this out of HTML' />
                        <Blink text='Look at me look at me look at me' />
                        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
                        <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
                        <View style={{width: 150, height: 150, backgroundColor: 'steelblue'}} />
                    </View>
                </ScrollView>
            </DrawerLayoutAndroid>
        );
    }
}

Drawer.propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onPush: PropTypes.func.isRequired,
};

class MyScene extends Component {
    render() {
        return (
            <View>
                <Text>Current Scene: {this.props.title}</Text>

                <TouchableHighlight onPress={this.props.onForward}>
                    <Text>Tap me to load the next scene</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.props.onBack}>
                    <Text>Tap me to go back</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

MyScene.propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

class Nav extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{ title: 'My Initial Scene', index: 0 }}
                renderScene={(route, navigator) =>
          <MyScene
            title={route.title}

            // Function to call when a new scene should be displayed
            onForward={() => {
              const nextIndex = route.index + 1;
              navigator.push({
                title: 'Scene ' + nextIndex,
                index: nextIndex,
              });
            }}

            // Function to call to go back to the previous scene
            onBack={() => {
              if (route.index > 0) {
                navigator.pop();
              }
            }}

            onPush={() => {
               navigator.push({
                title: 'PizzaScene',
                index: 1,
              });
            }

            }
          />
        }
            />
        )
    }
}

class ListViewBasics extends Component {
    // Initialize the hardcoded data
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([
                'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
            ])
        };
    }
    render() {
        return (
            <View style={{flex: 1, paddingTop: 22}}>
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={(rowData) => <Text>{rowData}</Text>}
              />
            </View>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bigblue: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
  },
  red: {
      color: 'red',
  },
});

AppRegistry.registerComponent('ReactNative_AwesomeProject', () => Nav);
