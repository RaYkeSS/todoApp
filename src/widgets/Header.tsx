import { Heading, IconButton, Link } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import { useThemeStore } from "../entities/theme/store.ts";

export const Header = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Heading textAlign="center">
      <IconButton aria-label="Github" mr={4} size="xl" variant="ghost" asChild>
        <Link href="https://github.com/RaYkeSS" target="_blank">
          <FaGithub />
        </Link>
      </IconButton>
      Список задач
      <IconButton
        aria-label="Сменить тему"
        onClick={toggleTheme}
        ml={4}
        size="xl"
        variant="ghost"
      >
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </IconButton>
    </Heading>
  );
};

export default Header;
