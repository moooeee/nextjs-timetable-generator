import { useState, useRef } from "react"
import { useOnClickOutside } from "../hooks/useOnClickOutside"
import { AnimatePresence, motion } from "framer-motion"
import styles from "./styles/subject.module.scss"
import { useDispatch } from "react-redux"
import {
  addRandomColorForSubject,
  addSubjectColor,
  deleteSubjectFromSchedule,
} from "../store/reducers"
import Modal from "./modal"
import Button from "./button"
import { ColorPicker, useColor } from "react-color-palette"
import "react-color-palette/lib/css/styles.css"
import ActionButton from "./actionButton"
import DeleteSubjectModal from "./deleteSubjectModal"
import Portal from "@reach/portal"

function SubjectGridBlock({
  name,
  instructor,
  startTime,
  endTime,
  blockStyles,
  color,
  day,
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  const colorPaletteRef = useRef(null)

  const [showConfirmation, setShowConfirmation] = useState(false)

  const dispatch = useDispatch()

  const blockRef = useRef()

  const [selectedColor, setSelectedColor] = useColor("hex", color)
  const [showColorPalette, setShowColorPalette] = useState(false)

  const colorRef = useRef(color)

  const [colorPalettePos, setColorPalettePos] = useState({ top: 0, right: 0 })

  useOnClickOutside(menuRef, () => setShowMenu(false))

  return (
    <motion.div
      positionTransition
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
      className={styles.subject}
      style={{
        gridRow: blockStyles[0],
        gridColumn: `${blockStyles[1]} / ${blockStyles[2]}`,
        background: color,
      }}
      onContextMenu={(e) => {
        e.preventDefault()

        const rect = e.target.getBoundingClientRect()
        const parentRect = e.target.parentNode.getBoundingClientRect()

        // 109 x 72 (dimensions of the modal)

        const left = e.pageX - rect.left
        const top = e.pageY - rect.top

        console.log(e.pageY, e.pageX)

        if (e.pageY + 72 > window.innerHeight) {
          setMenuPos((pos) => ({ ...pos, top: `calc(${e.pageY}px - 72px)` }))
        } else {
          setMenuPos((pos) => ({ ...pos, top: e.pageY }))
        }

        if (e.pageX + 109 > window.innerWidth) {
          setMenuPos((pos) => ({ ...pos, left: `calc(${e.pageX}px - 109px)` }))
        } else {
          setMenuPos((pos) => ({ ...pos, left: e.pageX }))
        }

        setShowMenu(true)
      }}
      key={`${name}-${day}`}
      ref={blockRef}
    >
      <p>{name}</p>
      <p style={{ fontSize: "14px", marginBottom: "3px" }}>{instructor}</p>
      <p>
        {startTime} - {endTime}
      </p>
      <AnimatePresence initial={false}>
        {showMenu && (
          <Portal>
            <motion.div
              positionTransition
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ ease: "easeOut", duration: 0.12 }}
              className={styles.menu}
              style={{ left: menuPos.left, top: menuPos.top, zIndex: 999 }}
              ref={menuRef}
            >
              <ul>
                <li
                  onClick={() => {
                    setShowConfirmation(true)
                    setShowMenu(false)
                  }}
                >
                  Delete Subject
                </li>
                <li
                  onClick={(e) => {
                    setShowColorPalette(true)
                    setShowMenu(false)

                    const rect = blockRef.current.getBoundingClientRect()
                    const parentRect =
                      blockRef.current.parentNode.getBoundingClientRect()

                    if (rect.top + 349 > parentRect.bottom) {
                      setColorPalettePos((pos) => ({
                        ...pos,
                        top: `-${rect.top + 349 - parentRect.bottom}px`,
                      }))
                    } else {
                      setColorPalettePos((pos) => ({ ...pos, top: 0 }))
                    }

                    if (rect.right + 428 > parentRect.right) {
                      setColorPalettePos((pos) => ({
                        ...pos,
                        right: `calc(100% + 5px)`,
                        left: undefined,
                      }))
                    } else {
                      setColorPalettePos((pos) => ({
                        ...pos,
                        right: undefined,
                        left: "calc(100% + 5px)",
                      }))
                    }

                    // 428 x 349 (dimensions of the color palette)
                  }}
                >
                  Change Color
                </li>
              </ul>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConfirmation && (
          <Modal
            isOpen={showConfirmation}
            close={() => setShowConfirmation(false)}
          >
            <div className={styles.modal}>
              <h2>Delete Subject</h2>
              <p>
                Are you sure you want to delete <strong>({name})</strong>{" "}
                subject from schedule
              </p>
              <Button
                onClick={() => {
                  dispatch(deleteSubjectFromSchedule(name))
                  setShowConfirmation(false)
                }}
              >
                Delete
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showColorPalette && (
          <motion.div
            positionTransition
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className={styles.colorPalette}
            style={{
              top: colorPalettePos.top,
              right: colorPalettePos.right,
              left: colorPalettePos.left,
            }}
            ref={colorPaletteRef}
          >
            <ColorPicker
              width={400}
              height={150}
              color={selectedColor}
              onChange={(e) => {
                setSelectedColor(e)
                dispatch(addSubjectColor(name, e.hex))
              }}
              hideHSV
              hideHSB
              hideRGB
              dark
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <ActionButton
                onClick={() => {
                  setShowColorPalette(false)
                  colorRef.current = selectedColor.hex
                }}
                style={{ width: "100%" }}
              >
                Save
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setShowColorPalette(false)
                  dispatch(addSubjectColor(name, colorRef.current))
                }}
                style={{ width: "100%" }}
              >
                Cancel
              </ActionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SubjectGridBlock
