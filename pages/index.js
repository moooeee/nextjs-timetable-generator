import Head from "next/head"
import Image from "next/image"
import { initializeStore } from "../store/store"
import { Subject, Population } from "../utils/generateSchedule"
import styles from "../styles/home.module.scss"
import Form from "../components/form"
import SubjectsList from "../components/subjectsList"

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2
        style={{
          fontFamily: "Whitney bold",
          margin: 0,
          textAlign: "center",
          color: "#059669",
        }}
      >
        The Islamic University Timetable Generator
      </h2>
      <div className={styles.container}>
        <div className={styles.formSide}>
          <h2>Add subjects</h2>
          <Form />
        </div>
        <div className={styles.subjectsListSide}>
          <h2>Subjects</h2>
          <SubjectsList />
        </div>
      </div>
    </div>
  )
}

export function getServerSideProps() {
  const store = initializeStore()

  return { props: { initialState: store.getState() } }
}
