/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//123
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, DrawerLayoutAndroid } from 'react-native'
import {
  Appbar,
  Button,
  TextInput,
  Title, Subheading, Text,
  IconButton,
  Surface,
  Colors,
  Drawer,
  Dialog, Portal
} from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as Animatable from 'react-native-animatable';

import SplashScreen from 'react-native-splash-screen';
import { Picker } from '@react-native-picker/picker'



const ItemCard = ({ i, e, tocalc, cred_txtchange, sub_txtchange, delItem, pnt_txtchange }) => {
  console.log("itemcard" + i);

  const thisref = useRef(null);

  return (
    <Animatable.View ref={thisref}>
      <Surface style={{ borderRadius: 20, margin: 10, elevation: 5, padding: 20, backgroundColor: 'lightyellow' }}>

        <TextInput editable={tocalc == 'gpa'} dense="true" style={{ marginBottom: 10, backgroundColor: 'transparent', fontWeight:'bold' }}
          placeholder={(tocalc == 'gpa' ? 'SUBJECT  ' : 'SEMESTER  ') + (i + 1)}
          onChangeText={(text) => { sub_txtchange(text, i) }} value={e.sub} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <TextInput dense="true" mode="outlined"
            onChangeText={(text) => cred_txtchange(text, i)}
            style={{ width: 100, marginRight: 10, backgroundColor: Colors.white }}
            label="CREDITS" value={e.cred.toString()} keyboardType="decimal-pad" />
          <TextInput dense="true" mode="outlined"
            onChangeText={(text) => pnt_txtchange(text, i)}
            style={{ width: 100, backgroundColor: Colors.white }}
            label={tocalc == 'cgpa' ? 'GPA' : 'POINTS'} value={e.pnt.toString()} keyboardType="number-pad" />
          <IconButton color={Colors.red500} icon="delete" size={25} onPress={() => { thisref.current.bounceOut(800).then(() => delItem(i)) }} />
        </View>
      </Surface>
    </Animatable.View>
  )
}

const CalcCont = ({ tocalc, list, storefunc, navigation }) => {
  console.log(tocalc + "render");

  const [st, setst] = useState(list);
  const [saveVis, setsaveVis] = useState(false);
  //const [resVis, setresVis] = useState(false);
  const [resTxt, setresTxt] = useState("");
  const [nametxt, setnametxt] = useState("");

  const [autofillVis, setAutofillVis] = useState(false);
  const [colPickState, setColPickState] = useState("");
  const [deptPickState, setDeptPickState] = useState("");
  const [semPickState, setSemPickState] = useState("sem4");

  const key_val = useRef(0);
  const autofillData = useRef({ data: {} });

  const addsub = () => {
    //alert(1)
    setst([...st, { sub: '', cred: '', pnt: '' }])
    setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 0);
  }

  const cred_txtchange = (text, i) => {
    let cur = [...st];
    cur[i].cred = parseInt(text) || 0;
    setst(cur)
  }

  const pnt_txtchange = (text, i) => {
    let cur = [...st];
    cur[i].pnt = text;
    setst(cur)
  }

  const sub_txtchange = (text, i) => {
    let cur = [...st];
    cur[i].sub = text;
    setst(cur)
  }

  const showAutofill = async () => {
    fetch("https://github.com/agilan2001/Grader/raw/master/data/gpa_data.json")
      .then((res) => res.json())
      .then((data) => {
        autofillData.current = data.data;
        var temp = Object.keys(data.data)[0];
        if (!colPickState) setColPickState(temp);
        if (!deptPickState) setDeptPickState(Object.keys(data.data[temp])[0]);
        setAutofillVis(true);
      });



  }

  const autofill = () => {
    var data = autofillData.current[colPickState][deptPickState];

    var new_st = [];
    if (tocalc == 'gpa') {
      Object.keys(data[semPickState]).forEach((e, i) => {
        new_st.push({
          sub: e,
          cred: data[semPickState][e],
          pnt: ""
        })
      });
    } else {
      
      for (var i = 1; i <= parseInt(semPickState.replace(/\D/g,'')); i++) {
        var tot = 0;
        Object.keys(data["sem" + i]).forEach((e, k) => {
          tot += parseInt(data["sem" + i][e]);
        });

        new_st.push({
          sub: "",
          cred: tot.toString(),
          pnt: ""
        })
        
      }
    }
    setst(new_st);

  }

  const calc = () => {
    var sop = 0, sc = 0;
    st.forEach((e, i) => {
      sop += (parseInt(e.cred) || 0) * (parseFloat(e.pnt) || 0);
      sc += parseInt(e.cred) || 0;
    });
    var res_gpa = ((sop / sc) || 0).toFixed(2);
    setresTxt(res_gpa);

    // Alert.alert("WoW !", `Your ${tocalc == 'cgpa' ? 'C' : ''}GPA is ${res_gpa}`,
    //   [{
    //     text: "SAVE",
    //     onPress: () => { setnametxt((tocalc == 'gpa' ? 'GPA (' : 'CGPA (') + new Date().toLocaleDateString("en-US") + ')'); setsaveVis(true) }
    //   },
    //   { text: "OK" }],
    //   { cancelable: true }
    // )

  }
  const delItem = (p) => {


    console.log(p)
    let cur = [...st];
    console.log(cur)
    cur.splice(p, 1);
    console.log(cur)
    key_val.current++;
    setst(cur);

  }
  useEffect(() => {
    setst(list);
    console.log(tocalc)
    if (list[0].cred) setTimeout(() => navigation.navigate(tocalc), 0)
  }, [list, tocalc])
  const scrollViewRef = useRef();
  return (
    <View style={{backgroundColor:tocalc=='gpa'?'lightgreen':'lightblue', flex:1}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 10 }}>
        <Button icon="flash-auto" style={{ width: 120, backgroundColor:'blue' }} mode="contained" onPress={showAutofill}>AUTOFILL</Button>
        <Button icon="plus" style={{ width: 130, backgroundColor:'orange' }} mode="contained" onPress={addsub}>{tocalc == 'cgpa' ? 'SEMESTER' : 'SUBJECT'}</Button>
        <Button icon='calculator' style={{ width: 130 }} mode="contained" onPress={calc}>CALCULATE</Button>
      </View>
      <ScrollView
        ref={scrollViewRef} style={{ marginBottom: 20 }}
      >
        {st.map((e, i) => (
          <ItemCard key={key_val.current + i.toString()} i={i} e={e} tocalc={tocalc} cred_txtchange={cred_txtchange} sub_txtchange={sub_txtchange} delItem={delItem} pnt_txtchange={pnt_txtchange} />
        ))}
      </ScrollView>
      <Portal>
        <Dialog style={{ backgroundColor: 'yellow' }} visible={autofillVis} onDismiss={() => { setAutofillVis(false); }}>
          <Dialog.Content>
            <Title style={{ textAlign: 'center' }}>AUTOFILL</Title>
            <Picker selectedValue={colPickState} onValueChange={(e, i) => setColPickState(e)}>
              {Object.keys(autofillData.current).map((e, i) => (<Picker.Item key={key_val.current + "clg" + i} label={e} value={e} />))}
            </Picker>
            <Picker selectedValue={deptPickState} onValueChange={(e, i) => setDeptPickState(e)}>
              {colPickState && Object.keys(autofillData.current[colPickState]).map((e, i) => (<Picker.Item key={key_val.current + "dept" + i} label={e} value={e} />))}
            </Picker>
            <Picker selectedValue={semPickState} onValueChange={(e, i) => setSemPickState(e)}>
              {colPickState && deptPickState && [...Array(8).keys()].map((e, i) => (<Picker.Item key={key_val.current + "sem" + i} label={"SEMESTER " + (e + 1)} value={"sem" + (e + 1)} />))}
            </Picker>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setAutofillVis(false); }}>CANCEL</Button>
            <Button onPress={() => { autofill(); setAutofillVis(false); }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog style={{ backgroundColor: 'lightblue' }} visible={resTxt} onDismiss={() => { setresTxt(""); }}>
          <Dialog.Content>
            <Title style={{ textAlign: 'center' }}>{tocalc == 'cgpa' ? 'C' : ''}GPA</Title>
            <Text style={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: 'red', }}>{resTxt}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setnametxt((tocalc == 'gpa' ? 'GPA (' : 'CGPA (') + new Date().toLocaleDateString("en-US") + ')'); setsaveVis(true); setresTxt("") }}>SAVE</Button>
            <Button onPress={() => { setresTxt(""); }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog style={{ backgroundColor: 'orange' }} visible={saveVis} onDismiss={() => { setsaveVis(false); }}>
          <Dialog.Content>
            <Subheading>Enter Reference Name : </Subheading>
            <TextInput defaultValue={nametxt} selectTextOnFocus={true} dense={true} style={{ backgroundColor: Colors.white }}
              onChangeText={(text) => setnametxt(text)} ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setsaveVis(false); }}>CANCEL</Button>
            <Button onPress={() => { storefunc({ name: nametxt, data: st }, tocalc); setsaveVis(false); }}>SAVE</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </View>

  )
}


const Tab = createMaterialTopTabNavigator();
const TabNav = ({ storefunc, gpaList, cgpaList }) => {
  console.log("TabNav render")

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'green',
          showIcon: true,
          // scrollEnabled:true,
        }}
      >
        <Tab.Screen
          name="gpa"

          options={{
            tabBarLabel: 'GPA',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="star-box" color={color} size={26} />
            ),
          }}
        >
          {(props) => <CalcCont {...props} storefunc={storefunc} tocalc="gpa" list={gpaList} />}
        </Tab.Screen>
        <Tab.Screen
          name="cgpa"

          options={{
            tabBarLabel: 'CGPA',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="star-box-multiple" color={color} size={26} />
            ),
          }}
        >
          {(props) => <CalcCont {...props} storefunc={storefunc} tocalc="cgpa" list={cgpaList} />}
        </Tab.Screen>

      </Tab.Navigator>

    </NavigationContainer>

  );
}

const App = () => {
  console.log("App render")
  const menu = useRef();
  const [hist, sethist] = useState({
    gpa: [],
    cgpa: []
  });
  console.log('hist at app' + JSON.stringify(hist))

  const [gpaList, setgpaList] = useState(Array.apply(null, Array(5)).map(_ => ({ sub: "", cred: "", pnt: '' })));
  const [cgpaList, setcgpaList] = useState(Array.apply(null, Array(2)).map(_ => ({ sub: "", cred: "", pnt: '' })));

  const storeData = async (sdata, toudp) => {
    try {
      console.log('hist' + JSON.stringify(hist))
      var temp = { ...hist };
      temp[toudp].push(JSON.parse(JSON.stringify(sdata)));
      console.log('temp :' + JSON.stringify(temp))
      sethist(temp);

      console.log('hist after :' + JSON.stringify(hist))
      const jsonValue = JSON.stringify(temp)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  //console.log(hist);
  useEffect(() => {
    console.log('fetch storage')
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // error reading value
      }
    }


    getData().then((val) => {
      if (val) sethist(val);
      SplashScreen.hide();
    })
  }, [])



  const navigationView = (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={{ backgroundColor: 'green' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'yellow', padding: 10 }}>GRADER</Text>
        <Text style={{ padding: 10, paddingTop: 0, color: 'white', fontWeight: 'bold', fontSize: 20 }}>Grade Points Calculator</Text>
      </View>
      <Drawer.Section title="Saved GPA" style={{ flex: 1 }}>
        <ScrollView>
          {hist.gpa.length ?
            JSON.parse(JSON.stringify(hist)).gpa.map((e, i) => (<Drawer.Item key={i}
              label={e.name}
              onPress={() => { setgpaList(e.data); menu.current.closeDrawer() }}
            />))
            : <Drawer.Item label={'[Empty]'} />}
        </ScrollView>
      </Drawer.Section>
      <Drawer.Section title="Saved CGPA" style={{ flex: 1 }}>
        <ScrollView>
          {hist.cgpa.length ?
            JSON.parse(JSON.stringify(hist)).cgpa.map((e, i) => (<Drawer.Item key={i}
              label={e.name}
              onPress={() => { setcgpaList(e.data); menu.current.closeDrawer() }}
            />))
            : <Drawer.Item label={'[Empty]'} />}
        </ScrollView>
      </Drawer.Section>
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red', padding: 10, textAlign: 'center' }}>[   AgiApps   ]</Text>
      </View>
    </View>
  );


  return (
    <DrawerLayoutAndroid
      ref={menu}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => navigationView}
    >

      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => { menu.current.openDrawer() }} />
        <Appbar.Content title="GRADER" subtitle={'AgiApps'} />
      </Appbar.Header>
      <TabNav storefunc={storeData} gpaList={gpaList} cgpaList={cgpaList} />
    </DrawerLayoutAndroid>
  );
};
export default App;
