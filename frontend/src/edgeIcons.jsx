
import { AddIcon, HamburgerIcon,  QuestionOutlineIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'
import { FaAnglesDown, FaAnglesUp} from "react-icons/fa6";
import { MdOutlineSpaceBar } from "react-icons/md";
import { AiOutlineEnter } from "react-icons/ai";
import { Box, } from "@chakra-ui/react";
import { IconButton } from '@chakra-ui/react'
import TextCarousel from './TextCarousel';
import PageHeader from './pageHeader';



function BottomRightIcons({toggleShowInput}) {
  return (
    <Box position="fixed" right="0" bottom="0" p="4">
      <IconButton
        aria-label='Add poem'
        variant='ghost'
        fontSize='20px'
        onClick={toggleShowInput}
        icon={<AddIcon />} />

      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label='Help'
            variant='ghost'
            fontSize='20px'
            icon={<QuestionOutlineIcon />} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
          <div className="popover-content">
              <FaAnglesUp className="icon-spacing" />
              =
              <ArrowUpIcon className="icon-spacing" />
            </div>
            <div className="popover-content">
               <FaAnglesDown className="icon-spacing" />
              =
              <MdOutlineSpaceBar className="icon-spacing" />
              /
              <AiOutlineEnter className="icon-spacing" />
              /
              <ArrowDownIcon className="icon-spacing" />
              / klikk
            </div>
            
            </PopoverBody>
        </PopoverContent>
      </Popover >

    </Box>
  );
}

function TopLeftHamburgerIcon() {
  return (
    <Box position="fixed" left="0" top="0" p="4">
      <IconButton
        aria-label='Menu'
        variant='ghost'
        fontSize='32px'
        icon={<HamburgerIcon />} />
    </Box>
  );
}

export default  BottomRightIcons
export {TopLeftHamburgerIcon}